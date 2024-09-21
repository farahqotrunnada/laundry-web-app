'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
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
import DataTableColumnHeader from '@/components/table/header';
import EditRequestAccessModal from './edit-modal';
import { Job } from '@/types/job';
import { MoreHorizontal } from 'lucide-react';
import { Outlet } from '@/types/outlet';
import { RequestAccess } from '@/types/request-access';
import axios from '@/lib/axios';
import { useAuth } from '@/hooks/use-auth';
import useConfirm from '@/hooks/use-confirm';
import { useSWRConfig } from 'swr';
import { useToast } from '@/hooks/use-toast';

const columns: ColumnDef<
  RequestAccess & {
    Job: Job;
    Outlet: Outlet;
    Employee: Employee & {
      User: User;
    };
  }
>[] = [
  {
    accessorKey: 'request_access_id',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Request Access ID' />;
    },
    cell: ({ row }) => {
      return <span className='font-medium uppercase text-muted-foreground'>{row.original.request_access_id}</span>;
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
    accessorKey: 'Employee.User.fullname',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Employee Name' />;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Status' />;
    },
    cell: ({ row }) => {
      return <Badge>{row.original.status}</Badge>;
    },
  },
  {
    id: 'actions',
    enableSorting: false,
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Actions' />;
    },
    cell: ({ row }) => {
      return <TableAction row={row} />;
    },
  },
];

interface TableActionProps {
  row: Row<
    RequestAccess & {
      Job: Job;
      Outlet: Outlet;
      Employee: Employee & {
        User: User;
      };
    }
  >;
}

const TableAction: React.FC<TableActionProps> = ({ row }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const { mutate } = useSWRConfig();

  const handleDelete = async () => {
    confirm({
      variant: 'destructive',
      title: 'Delete Request Access',
      description:
        'Are you sure you want to delete this request access? this action will also delete all related data.',
    })
      .then(async () => {
        try {
          await axios.delete('/request-accesses/' + row.original.request_access_id);
          toast({
            title: 'Request access deleted',
            description: 'Your request access has been deleted successfully',
          });
          mutate((key) => Array.isArray(key) && key.includes('/request-accesses'));
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Failed to delete request access',
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
        {user && (user.role === 'SuperAdmin' || user.role === 'OutletAdmin') ? (
          <>
            <EditRequestAccessModal request_access={row.original as RequestAccess} />
            <DropdownMenuItem onClick={handleDelete}>Delete Request Access</DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem>No Actions</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default columns;
