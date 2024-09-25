'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import DataTableColumnHeader from '@/components/table/header';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import { Outlet } from '@/types/outlet';
import axios from '@/lib/axios';
import useConfirm from '@/hooks/use-confirm';
import { useSWRConfig } from 'swr';
import { useToast } from '@/hooks/use-toast';

const columns: ColumnDef<Outlet>[] = [
  {
    accessorKey: 'outlet_id',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Outlet ID' />;
    },
    cell: ({ row }) => {
      return <span className='font-medium uppercase text-muted-foreground'>{row.original.outlet_id}</span>;
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Outlet Name' />;
    },
  },
  {
    accessorKey: 'address',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Address' />;
    },
  },
  {
    accessorKey: 'city',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='City' />;
    },
  },
  {
    accessorKey: 'region',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Region' />;
    },
  },
  {
    id: 'actions',
    enableSorting: false,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Actions' />;
    },
    cell: ({ row }) => {
      return <Action outlet={row.original} />;
    },
  },
];

interface ActionProps {
  outlet: Outlet;
}

const Action: React.FC<ActionProps> = ({ outlet }) => {
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const { mutate } = useSWRConfig();

  const handleDelete = async () => {
    confirm({
      variant: 'destructive',
      title: 'Delete Outlet',
      description:
        'Are you sure you want to delete this outlet? this action will also delete all related resources that associated with this outlet, i.e. orders, employee, deliveries, jobs, payments, etc.',
    })
      .then(async () => {
        try {
          await axios.delete('/outlets/' + outlet.outlet_id);
          toast({
            title: 'Outlet deleted',
            description: 'Outlet has been deleted successfully',
          });
          mutate((key) => Array.isArray(key) && key.includes('/outlets'));
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Failed to delete outlet',
            description: error.message,
          });
        }
      })
      .catch(() => {
        // do nothing
      });
  };

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
        <Link href={'/dashboard/outlets/' + outlet.outlet_id} className='w-full'>
          <DropdownMenuItem>View Oultet</DropdownMenuItem>
        </Link>
        <Link href={'/dashboard/outlets/' + outlet.outlet_id + '/edit'} className='w-full'>
          <DropdownMenuItem>Edit Outlet</DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={handleDelete}>Delete Outlet</DropdownMenuItem>
        <Link href={'/dashboard/outlets/' + outlet.outlet_id + '/employees'} className='w-full'>
          <DropdownMenuItem>Manage Employees</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default columns;
