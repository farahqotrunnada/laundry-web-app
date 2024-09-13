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

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import DataTableColumnHeader from '@/components/table/header';
import { MoreHorizontal } from 'lucide-react';
import { Outlet } from '@/types/outlet';
import { User } from '@/types/user';
import { formatDate } from '@/lib/utils';

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
    cell: ({ row }) => {
      return <Badge className='whitespace-nowrap'>{row.original.OrderProgress?.name}</Badge>;
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Price' />;
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
            <DropdownMenuItem>Edit Outlet</DropdownMenuItem>
            <DropdownMenuItem>Delete Outlet</DropdownMenuItem>
            <DropdownMenuItem>View Employee</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default columns;
