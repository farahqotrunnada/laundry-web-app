'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Order, OrderProgress } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import DataTableColumnHeader from '@/components/table/header';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import { Outlet } from '@/types/outlet';
import { User } from '@/types/user';

const columns: ColumnDef<
  Order & {
    Outlet?: Outlet;
    Customer?: {
      User?: User;
    };
    OrderProgress?: OrderProgress;
  }
>[] = [
  {
    accessorKey: 'order_id',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Order ID' />;
    },
    cell: ({ row }) => {
      return <span className='block w-32 font-medium uppercase truncate'>{row.original.order_id}</span>;
    },
  },
  {
    enableSorting: false,
    accessorKey: 'Outlet.name',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Outlet Name' />;
    },
  },
  {
    enableSorting: false,
    accessorKey: 'Customer.User.fullname',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Customer Name' />;
    },
  },
  {
    enableSorting: false,
    accessorKey: 'OrderProgress.name',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Order Progress' />;
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Price' />;
    },
    cell: ({ row }) => {
      return <Badge>{formatCurrency(row.original.price)}</Badge>;
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Created' />;
    },
    cell: ({ row }) => {
      return <span>{formatDate(row.getValue('created_at') as string)}</span>;
    },
  },
  {
    id: 'actions',
    enableSorting: false,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Actions' />;
    },
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='w-8 h-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='w-4 h-4' />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={'/dashboard/orders/' + row.original.order_id} className='w-full'>
              <DropdownMenuItem>View Order</DropdownMenuItem>
            </Link>
            <Link href={'/dashboard/orders/' + row.original.order_id + '/create'} className='w-full'>
              <DropdownMenuItem>Add Order Items</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default columns;
