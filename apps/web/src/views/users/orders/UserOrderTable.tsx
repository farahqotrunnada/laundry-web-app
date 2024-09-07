'use client';

import { Alert, Chip } from '@mui/material';
import { ColumnDef, HeaderGroup, PaginationState, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { DebouncedInput, TablePagination } from 'components/third-party/react-table';
import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Ethereum } from 'iconsax-react';
import Grid from '@mui/material/Grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MainCard from 'components/MainCard';
import { Order } from 'hooks/useOrders';
import ScrollX from 'components/ScrollX';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { formatDate } from 'utils/dateUtils';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import useUserOrders from 'hooks/useUserOrders';

interface ReactTableProps {
  columns: ColumnDef<Order>[];
  data: Order[];
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

interface UserOrderTableProps {
  user_id: number;
}

export default function UserOrderTable({ user_id }: UserOrderTableProps) {
  const theme = useTheme();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramsDate = searchParams.get('date') ? new Date(searchParams.get('date')!) : null;
  const paramPage = Number(searchParams.get('page') || 1);
  const paramLimit = Math.min(Number(searchParams.get('limit') || 10), 100);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: paramPage,
    pageSize: paramLimit
  });

  const [search, setSearch] = useState<string>('');
  const [date, setDate] = useState<Date | null>(paramsDate);
  const { data, error, loading } = useUserOrders(user_id, search, pagination, date);
  const { orders, count } = useMemo(() => {
    if (data) {
      return {
        orders: data.orders,
        count: data.count
      };
    }
    return {
      orders: [],
      count: 0
    };
  }, [data]);

  useEffect(() => {
    const current = new URLSearchParams(window.location.search);

    current.set('search', search);
    current.set('page', String(pagination.pageIndex + 1));
    current.set('limit', String(pagination.pageSize));
    date && current.set('date', date.toISOString());

    router.push(`${pathname}?${current}`);
  }, [pagination, pathname, router, date, search]);

  const columns = useMemo<ColumnDef<Order>[]>(
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
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        width: '100%',
        minHeight: '90vh',
        paddingY: theme.spacing(10)
      }}
    >
      <Grid container spacing={2.5} justifyContent="center">
        <Grid item xs={12} md={8}>
          <MainCard content={false}>
            <ScrollX>
              <ReactTable
                columns={columns}
                data={orders || []}
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
        </Grid>
      </Grid>
    </Box>
  );
}
