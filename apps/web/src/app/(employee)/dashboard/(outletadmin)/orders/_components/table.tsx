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
import { useOrders } from '@/hooks/use-orders';

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
    order_id: false,
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
          placeholder='Filter Order by ID'
          value={(table.getColumn('order_id')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('order_id')?.setFilterValue(event.target.value)}
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

const OrderTable = () => {
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
  const { data, error, isLoading } = useOrders(filter, pagination, sorting);

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
  if (error || !data) return <div>Failed to load orders data, retrying...</div>;

  return (
    <DataTable
      columns={columns}
      // data={data.data.orders.map((order) => ({ ...order, OrderProgress: order.OrderProgress!.at(0) }))}
      data={data.data.orders}
      pageCount={Math.ceil(data.data.count / pagination.pageSize)}
      sorting={sorting}
      onSortingChange={setSorting}
      pagination={pagination}
      onPaginationChange={setPagination}
      columnFilters={columnFilters}
      setColumnFilters={setColumnFilters}
    />
  );
};

export default OrderTable;
