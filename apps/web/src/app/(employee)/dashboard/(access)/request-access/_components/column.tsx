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
import DetailModal from '@/components/modal-detail';
import EditRequestAccessModal from './edit-modal';
import { Job } from '@/types/job';
import { MoreHorizontal } from 'lucide-react';
import { Outlet } from '@/types/outlet';
import { RequestAccess } from '@/types/request-access';
import axios from '@/lib/axios';
import { formatDateTime } from '@/lib/utils';
import { statusColor } from '@/lib/constant';
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
      return <Badge className={statusColor[row.original.status]}>{row.original.status}</Badge>;
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
            description: 'Request access has been deleted successfully',
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
        <DetailModal
          title='Request Access Details'
          description='View the details of this request access, including the request access ID, job ID, reason, status, created and updated date.'
          details={[
            {
              key: 'Request Access ID',
              value: row.original.request_access_id,
            },
            {
              key: 'Order ID',
              value: row.original.Job.order_id,
            },
            {
              key: 'Job ID',
              value: row.original.Job.job_id,
            },
            {
              key: 'Outlet Name',
              value: row.original.Outlet.name,
            },
            {
              key: 'Employee In Charge',
              value: row.original.Employee ? row.original.Employee.User.fullname : 'None',
            },
            {
              key: 'Reason',
              value: row.original.reason,
              long: true,
            },
            {
              key: 'Status',
              value: row.original.status,
            },
            {
              key: 'Created',
              value: formatDateTime(row.original.created_at),
            },
            {
              key: 'Updated',
              value: formatDateTime(row.original.updated_at),
            },
          ]}>
          <div className='block w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted cursor-default'>View Detail</div>
        </DetailModal>
        {user && (user.role === 'SuperAdmin' || user.role === 'OutletAdmin') && (
          <>
            <EditRequestAccessModal request_access={row.original as RequestAccess} />
            <DropdownMenuItem onClick={handleDelete}>Delete Request Access</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default columns;
