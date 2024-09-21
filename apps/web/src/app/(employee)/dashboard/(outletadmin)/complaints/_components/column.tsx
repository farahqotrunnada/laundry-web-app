'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Customer, Employee, User } from '@/types/user';
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
import { Complaint } from '@/types/complaint';
import DataTableColumnHeader from '@/components/table/header';
import { Delivery } from '@/types/delivery';
import EditComplaintModal from './edit-modal';
import { MoreHorizontal } from 'lucide-react';
import { Order } from '@/types/order';
import { Outlet } from '@/types/outlet';
import { ProgressType } from '@/types/shared';
import axios from '@/lib/axios';
import useConfirm from '@/hooks/use-confirm';
import { useSWRConfig } from 'swr';
import { useToast } from '@/hooks/use-toast';

const columns: ColumnDef<
  Complaint & {
    Order: Order;
    Customer: Customer & {
      User: User;
    };
  }
>[] = [
  {
    accessorKey: 'complaint_id',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Complaint ID' />;
    },
    cell: ({ row }) => {
      return <span className='font-medium uppercase text-muted-foreground'>{row.original.complaint_id}</span>;
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
    accessorKey: 'description',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Description' />;
    },
  },
  {
    accessorKey: 'resolution',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Resolution' />;
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
    Complaint & {
      Order: Order;
      Customer: Customer & {
        User: User;
      };
    }
  >;
}

const TableAction: React.FC<TableActionProps> = ({ row }) => {
  const { mutate } = useSWRConfig();
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const handleDelete = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    confirm({
      variant: 'destructive',
      title: 'Delete Complaint',
      description: 'Are you sure you want to delete this complaint? this action will also delete all related data.',
    })
      .then(async () => {
        try {
          await axios.delete('/complaints/' + row.original.complaint_id);
          toast({
            title: 'Complaint deleted',
            description: 'Your complaint has been deleted successfully',
          });
          mutate((key) => Array.isArray(key) && key.includes('/complaints'));
        } catch (error: any) {
          toast({
            variant: 'destructive',
            title: 'Failed to delete complaint',
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
        <EditComplaintModal complaint={row.original as Complaint} />
        <DropdownMenuItem onClick={handleDelete}>Delete Complaint</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default columns;
