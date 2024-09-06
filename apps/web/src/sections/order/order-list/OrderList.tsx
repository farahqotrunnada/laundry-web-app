'use client';

import React, { useEffect, useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// third-party
import { flexRender, useReactTable, ColumnDef, HeaderGroup, getCoreRowModel, PaginationState } from '@tanstack/react-table';

// project import
import ScrollX from 'components/ScrollX';
import MainCard from 'components/MainCard';
import { TablePagination, DebouncedInput } from 'components/third-party/react-table';
import { Alert, Chip } from '@mui/material';
import { formatDate } from 'utils/dateUtils';
import useCustomerOrder, { CustomerOrder } from 'api/customer-order';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Ethereum } from 'iconsax-react';

interface ReactTableProps {
  columns: ColumnDef<CustomerOrder>[];
  data: CustomerOrder[];
  title?: string;
  date: Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  pageCount: number;
  pagination: PaginationState;
  onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>;
}

function ReactTable({
  columns,
  data,
  title,
  date,
  setDate,
  search,
  setSearch,
  pageCount,
  pagination,
  onPaginationChange
}: ReactTableProps) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination
    },
    pageCount,
    manualPagination: true,
    enableRowSelection: true,
    onPaginationChange: onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true
  });

  return (
    <MainCard content={false} title={title}>
      <Box sx={{ p: 3, pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="h5">Order List</Typography>
        </Stack>
      </Box>
      <Stack
        direction={matchDownSM ? 'column' : 'row'}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ padding: 2.5 }}
      >
        <DebouncedInput
          value={search}
          onFilterChange={(value) => setSearch(value as string)}
          placeholder={`Search ${data.length} records...`}
          sx={{
            width: matchDownSM ? '100%' : '48%', // 48% untuk setengah lebar di desktop
            flexBasis: matchDownSM ? '100%' : '48%' // memastikan setengah lebar di mobile
          }}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Filter by Date"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            sx={{
              width: matchDownSM ? '100%' : '48%', // 48% untuk setengah lebar di desktop
              flexBasis: matchDownSM ? '100%' : '48%' // memastikan setengah lebar di mobile
            }}
          />
        </LocalizationProvider>
      </Stack>
      <ScrollX>
        <Stack>
          <TableContainer>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell key={header.id} {...header.column.columnDef.meta}>
                        {header.isPlaceholder ? null : (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box>{flexRender(header.column.columnDef.header, header.getContext())}</Box>
                          </Stack>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
                  <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                    <TablePagination
                      {...{
                        setPageSize: table.setPageSize,
                        setPageIndex: table.setPageIndex,
                        getState: table.getState,
                        getPageCount: table.getPageCount,
                        initialPageSize: pagination.pageSize
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </ScrollX>
    </MainCard>
  );
}

export default function OrderList({ customerId }: { customerId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: Number(searchParams.get('page') || '0'),
    pageSize: Number(searchParams.get('limit') || '10')
  });

  const selectedDate = searchParams.get('date') ? new Date(searchParams.get('date')!) : null;

  const [search, setSearch] = useState<string>('');
  const [date, setDate] = useState<Date | null>(selectedDate);
  const { data, count, error, loading } = useCustomerOrder(customerId, search, pagination, date);

  useEffect(() => {
    const current = new URLSearchParams(window.location.search);

    current.set('search', search);
    current.set('page', String(pagination.pageIndex + 1));
    current.set('limit', String(pagination.pageSize));
    date && current.set('date', date.toISOString());

    router.push(`${pathname}?${current}`);
  }, [pagination, pathname, router, date, search]);

  const columns = useMemo<ColumnDef<CustomerOrder>[]>(
    () => [
      {
        header: 'Transaction ID',
        accessorKey: 'transaction_id',
        cell: ({ row }) => <Typography variant="subtitle1">{row.original.transaction_id}</Typography>
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: (props) => {
          switch (props.getValue()) {
            default:
              return <Chip color="warning" label="Menunggu Penjemputan Driver" size="small" variant="light" />;
          }
        }
      },
      {
        header: 'Created At',
        accessorKey: 'created_at',
        cell: ({ row }) => <Typography>{formatDate(row.original.created_at)}</Typography>
      },
      {
        header: 'Updated At',
        accessorKey: 'updated_at',
        cell: ({ row }) => <Typography>{formatDate(row.original.updated_at)}</Typography>
      }
    ],
    []
  );

  if (loading) return <span>loading</span>;

  if (error) {
    return (
      <Alert color="error" icon={<Ethereum variant="Bold" />}>
        {error}
      </Alert>
    );
  }

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable
          columns={columns}
          data={data || []}
          title="Order Details"
          date={date}
          setDate={setDate}
          search={search}
          setSearch={setSearch}
          pagination={pagination}
          onPaginationChange={setPagination}
          pageCount={count ? Math.round(count / pagination.pageSize) : 0}
        />
      </ScrollX>
    </MainCard>
  );
}
