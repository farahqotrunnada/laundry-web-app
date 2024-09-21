'use client';

import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Action as ActionProps } from '@radix-ui/react-toast';
import { Button } from '@/components/ui/button';
import { Complaint } from '@/types/complaint';
import EditComplaintModal from './edit-modal';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import axios from '@/lib/axios';
import useConfirm from '@/hooks/use-confirm';
import { useCustomerComplaints } from '@/hooks/use-user-complaints';
import { useToast } from '@/hooks/use-toast';

interface CustomerComplaintTableProps {
  //
}

const CustomerComplaintGrid: React.FC<CustomerComplaintTableProps> = ({ ...props }) => {
  const { data, error, isLoading } = useCustomerComplaints();

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>failed to load complaints data, retrying...</div>;

  if (data.data.length === 0) {
    return (
      <div className='flex items-center justify-center w-full h-96'>
        <div className='flex flex-col items-center justify-center'>
          <div className='text-center'>
            <p className='text-xl font-bold'>No complaints found</p>
            <p className='text-sm text-muted-foreground'>There's no complaints for this customer.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 gap-4'>
      {data.data.map((complaint, idx) => (
        <div key={idx} className='relative flex flex-col p-4 space-y-4 border rounded-lg bg-background'>
          <div className='flex flex-col space-y-1'>
            <div className='text-sm font-medium'>Description</div>
            <Link href={'/orders/' + complaint.order_id} className='text-sm text-primary'>
              {complaint.order_id}
            </Link>
          </div>

          <div className='flex flex-col space-y-1'>
            <div className='text-sm font-medium'>Description</div>
            <div className='text-sm text-muted-foreground'>{complaint.description}</div>
          </div>

          <div className='flex flex-col space-y-1'>
            <div className='text-sm font-medium'>Resolution</div>
            <div className='text-sm text-muted-foreground'>{complaint.resolution}</div>
          </div>

          <div className='absolute top-0 right-0 m-4'>
            <Action complaint={complaint} />
          </div>
        </div>
      ))}
    </div>
  );
};

interface ActionProps {
  complaint: Complaint;
}

const Action: React.FC<ActionProps> = ({ complaint }) => {
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const { mutate } = useCustomerComplaints();

  const handleDelete = async () => {
    confirm({
      variant: 'destructive',
      title: 'Delete Complaint',
      description: 'Are you sure you want to delete this complaint? this action will also delete all related data.',
    })
      .then(async () => {
        try {
          await axios.delete('/profile/complaints/' + complaint.complaint_id);
          toast({
            title: 'Complaint deleted',
            description: 'Your complaint has been deleted successfully',
          });
          mutate();
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
        <EditComplaintModal complaint={complaint} />
        <DropdownMenuItem onClick={handleDelete}>Delete Complaint</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomerComplaintGrid;
