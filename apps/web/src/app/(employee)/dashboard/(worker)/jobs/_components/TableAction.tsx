'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';
import { TableActionProps } from './column';
import axios from '@/lib/axios';
import useConfirm from '@/hooks/use-confirm';
import { useSWRConfig } from 'swr';
import { useToast } from '@/hooks/use-toast';

export const TableAction: React.FC<TableActionProps> = ({ row }) => {
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
        <Dialog>
          <DialogTrigger asChild>
            <div className='block w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted cursor-default'>View Job</div>
          </DialogTrigger>

          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>View Job</DialogTitle>
              <DialogDescription>View the details of this job.</DialogDescription>
            </DialogHeader>

            <div className='grid gap-4'>
              <div className='flex flex-col space-y-4 text-sm'></div>
            </div>

            <DialogFooter className='mt-4 sm:justify-end'>
              <DialogClose asChild>
                <Button type='button' variant='secondary'>
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
        {row.original.progress === 'Completed' && <DropdownMenuItem>No Actions</DropdownMenuItem>}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
