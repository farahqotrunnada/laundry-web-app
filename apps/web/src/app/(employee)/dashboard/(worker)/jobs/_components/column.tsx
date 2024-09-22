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
import { formatDateTime, relativeTime } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DataTableColumnHeader from '@/components/table/header';
import DetailModal from '@/components/modal-detail';
import { Job } from '@/types/job';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import { Order } from '@/types/order';
import { Outlet } from '@/types/outlet';
import { RequestAccess } from '@/types/request-access';
import axios from '@/lib/axios';
import { progressColor } from '@/lib/constant';
import useConfirm from '@/hooks/use-confirm';
import { useSWRConfig } from 'swr';
import { useToast } from '@/hooks/use-toast';

const columns: ColumnDef<
  Job & {
    Order: Order;
    Outlet: Outlet;
    Employee?: Employee & {
      User: User;
    };
    RequestAccess?: RequestAccess;
  }
>[] = [
  {
    enableSorting: false,
    accessorKey: 'Outlet.name',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Outlet Name' />;
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Type' />;
    },
    cell: ({ row }) => {
      return <Badge>{row.original.type}</Badge>;
    },
  },
  {
    enableSorting: false,
    accessorKey: 'Employee.User.fullname',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Employee Name' />;
    },
    cell: ({ row }) => {
      return <span>{row.original.Employee ? row.original.Employee.User.fullname : null}</span>;
    },
  },
  {
    accessorKey: 'progress',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Progress' />;
    },
    cell: ({ row }) => {
      return <Badge className={progressColor[row.original.progress]}>{row.original.progress}</Badge>;
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Created' />;
    },
    cell: ({ row }) => {
      return <span className='whitespace-nowrap'>{relativeTime(row.getValue('created_at') as string)}</span>;
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
    Job & {
      Order: Order;
      Outlet: Outlet;
      Employee?: Employee & {
        User: User;
      };
      RequestAccess?: RequestAccess;
    }
  >;
}

const TableAction: React.FC<TableActionProps> = ({ row }) => {
  const { mutate } = useSWRConfig();
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const confirmJob = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    confirm({
      title: 'Accept Job',
      description: 'Are you sure you want to accept this job?',
    })
      .then(async () => {
        try {
          await axios.post('/jobs/' + row.original.job_id + '/accept');
          toast({
            title: 'Job accepted',
            description: 'Your job has been accepted successfully',
          });
          mutate((key) => Array.isArray(key) && key.includes('/jobs'));
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Failed to accept job',
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
          title='Job Details'
          description='View the details of this job, including the job ID, outlet name, type, created and updated date.'
          details={[
            {
              key: 'Job ID',
              value: row.original.job_id,
            },
            {
              key: 'Order ID',
              value: row.original.Order.order_id,
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
              key: 'Type',
              value: row.original.type,
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
        {row.original.RequestAccess && row.original.RequestAccess.status === 'Accepted' && (
          <Link href={`/dashboard/orders/${row.original.order_id}`}>
            <DropdownMenuItem>View Order</DropdownMenuItem>
          </Link>
        )}
        {row.original.progress === 'Pending' && <DropdownMenuItem onClick={confirmJob}>Start Job</DropdownMenuItem>}
        {row.original.progress === 'Ongoing' && (
          <Link href={`/dashboard/jobs/${row.original.job_id}/complete`}>
            <DropdownMenuItem>Complete Job</DropdownMenuItem>
          </Link>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default columns;
