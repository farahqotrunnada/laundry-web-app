'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Employee, User } from '@/types/user';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import DataTableColumnHeader from '@/components/table/header';
import EditEmployeeModal from './edit-modal';
import { MoreHorizontal } from 'lucide-react';
import { Shift } from '@/types/shift';
import axios from '@/lib/axios';
import useConfirm from '@/hooks/use-confirm';
import { useSWRConfig } from 'swr';
import { useToast } from '@/hooks/use-toast';

const columns: ColumnDef<
  User & {
    Employee: Employee & {
      Shift?: Shift;
    };
  }
>[] = [
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
    accessorKey: 'Employee.Shift',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Shift' />;
    },
    cell: ({ row }) => {
      const { Employee } = row.original;

      return (
        <Badge variant='outline'>
          {Employee.Shift ? Employee.Shift.start + ' - ' + Employee.Shift.end : 'No shift'}
        </Badge>
      );
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
  {
    id: 'actions',
    enableSorting: false,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Actions' />;
    },
    cell: ({ row }) => {
      const { outlet_id } = row.original.Employee;
      const { user_id } = row.original;
      return <Action outlet_id={outlet_id} user_id={user_id} />;
    },
  },
];

interface ActionProps {
  outlet_id: string;
  user_id: string;
}

const Action: React.FC<ActionProps> = ({ outlet_id, user_id }) => {
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const { mutate } = useSWRConfig();

  const handleDelete = async () => {
    confirm({
      variant: 'destructive',
      title: 'Delete Employee',
      description: `Are you sure you want to delete this employee? make sure the details are correct, this action
      will also delete all related resources that associated with this employee, i.e. orders, deliveries, jobs, etc.`,
    })
      .then(async () => {
        try {
          await axios.delete('/outlets/' + outlet_id + '/employees/' + user_id);
          toast({
            title: 'Employee deleted',
            description: 'Employee has been deleted successfully',
          });
          mutate((key) => Array.isArray(key) && key.includes('/outlets/' + outlet_id + '/employees'));
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Failed to delete employee',
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
        <EditEmployeeModal outlet_id={outlet_id} user_id={user_id} />
        <DropdownMenuItem onClick={() => handleDelete()}>Delete Employee</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default columns;
