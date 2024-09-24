'use client';

import * as React from 'react';

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { DataTablePagination } from '@/components/table/pagination';
import { Input } from '@/components/ui/input';
import TableLoader from '@/components/loader/table';
import ToggleColumn from '@/components/table/column-toggle';
import columns from './column';
import { useDebounceValue } from 'usehooks-ts';
import { useDeliveries } from '@/hooks/use-deliveries';
import dynamic from 'next/dynamic';
import { MapLoader } from '@/components/loader/map';

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  pageCount: number;
  sorting: SortingState;
  onSortingChange: React.Dispatch<React.SetStateAction<SortingState>>;
  pagination: PaginationState;
  onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

const DataTable = <TData, TValue>({
  columns,
  data,
  pageCount,
  sorting,
  onSortingChange,
  columnFilters,
  setColumnFilters,
  pagination,
  onPaginationChange,
}: DataTableProps<TData, TValue>) => {
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    delivery_id: false,
  });

  const table = useReactTable({
    data: data,
    columns,
    pageCount,
    manualFiltering: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: onSortingChange,
    onPaginationChange: onPaginationChange,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className='w-full'>
      <div className='flex flex-col mb-6 space-y-4 lg:justify-between lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4'>
        <Input
          autoFocus
          placeholder='Filter Delivery by ID'
          value={(table.getColumn('delivery_id')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('delivery_id')?.setFilterValue(event.target.value)}
          className='w-full lg:max-w-md'
        />

        <div className='flex flex-col items-center w-full space-x-2 space-y-4 lg:w-auto lg:flex-row lg:space-y-0 lg:space-x-4'>
          <ToggleColumn table={table} />
        </div>
      </div>

      <div className='mb-6 border rounded-md'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
};

interface DevlieryTableProps {
  //
}

const DeliveryTable: React.FC<DevlieryTableProps> = ({ ...props }) => {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filter] = useDebounceValue<ColumnFiltersState>(columnFilters, 500);
  const { data, error, isLoading } = useDeliveries(filter, pagination, sorting);

  const MapRange = React.useMemo(
    () =>
      dynamic(() => import('@/components/map-range'), {
        loading: () => <MapLoader className='w-full aspect-[4/1]' />,
        ssr: false,
      }),
    []
  );

  const [filtered, center] = React.useMemo(() => {
    if (!data) return [null, null];
    if (data.data.deliveries.length === 0) return [null, null];

    const temp = data.data.deliveries.filter((delivery) => delivery.progress !== 'Completed');
    const latitude = temp.reduce((acc, curr) => acc + Number(curr.Order.CustomerAddress.latitude), 0);
    const longitude = temp.reduce((acc, curr) => acc + Number(curr.Order.CustomerAddress.longitude), 0);

    const center = {
      latitude: latitude / temp.length,
      longitude: longitude / temp.length,
    };
    return [temp, center];
  }, [data]);

  React.useEffect(() => {
    if (search.has('page')) {
      const page = Number(search.get('page'));
      setPagination((p) => ({ ...p, pageIndex: page }));
    }

    if (search.has('limit')) {
      const limit = Number(search.get('limit'));
      setPagination((p) => ({ ...p, pageSize: limit }));
    }

    if (search.has('id') && search.has('value')) {
      const id = search.get('id') as string;
      const value = search.get('value') as string;
      setColumnFilters((f) => [...f, { id, value }]);
    }

    if (search.has('key') && search.has('desc')) {
      const key = search.get('key') as string;
      const desc = search.get('desc') as string;
      setSorting((s) => [...s, { id: key, desc: desc === 'true' }]);
    }
  }, [search, setPagination]);

  React.useEffect(() => {
    const params = new URLSearchParams();

    params.set('page', pagination.pageIndex.toString());
    params.set('limit', pagination.pageSize.toString());

    if (filter.length > 0) {
      const item = filter[0];
      params.set('id', item.id);
      params.set('value', item.value as string);
    }

    if (sorting.length > 0) {
      const item = sorting[0];
      params.set('key', item.id);
      params.set('desc', item.desc.toString());
    }

    const out = params.toString();

    router.push(`${pathname}?${out}`);
  }, [router, pathname, pagination, sorting, filter]);

  if (isLoading) return <TableLoader />;
  if (error || !data) return <div>failed to load deliveries data, retrying...</div>;

  return (
    <>
      {filtered && center && (
        <MapRange
          center={center}
          points={filtered.map((delivery) => ({
            latitude: delivery.Order.CustomerAddress.latitude,
            longitude: delivery.Order.CustomerAddress.longitude,
            name: delivery.Order.Customer.User.fullname,
          }))}
          className='w-full aspect-[4/1]'
        />
      )}

      <DataTable
        columns={columns}
        data={data.data.deliveries}
        pageCount={Math.ceil(data.data.count / pagination.pageSize)}
        sorting={sorting}
        onSortingChange={setSorting}
        pagination={pagination}
        onPaginationChange={setPagination}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </>
  );
};

export default DeliveryTable;
