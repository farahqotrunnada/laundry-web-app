'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import DataTableColumnHeader from '@/components/table/header';
import { MoreHorizontal } from 'lucide-react';
import { User } from '@/types/user';

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'fullname',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='User Name' />;
    },
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Phone' />;
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Email' />;
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Role' />;
    },
    cell: ({ row }) => {
      return <Badge>{row.original.role}</Badge>;
    },
  },
];

export default columns;
