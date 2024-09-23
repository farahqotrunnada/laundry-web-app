import * as React from 'react';

import { Clock, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
import EditShiftModal from './edit-modal';
import { Shift } from '@/types/shift';
import axios from '@/lib/axios';
import { cn } from '@/lib/utils';
import moment from 'moment';
import useConfirm from '@/hooks/use-confirm';
import { useShifts } from '@/hooks/use-shifts';
import { useToast } from '@/hooks/use-toast';

interface ShiftCardProps {
  shift: Shift;
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shift, ...props }) => {
  return (
    <div className='relative w-full border rounded-lg cursor-pointer bg-card' {...props}>
      <div className='flex items-center w-full p-8 space-x-6 text-sm'>
        <div className='flex flex-col flex-none space-y-1'>
          <span className='text-muted-foreground'>Shift Start</span>
          <div className='flex items-center space-x-2'>
            <Clock className='flex-none size-5' />
            <span>{shift.start}</span>
          </div>
        </div>

        <div className='flex items-center justify-center w-full'>
          <Action shift={shift} />
        </div>

        <div className='flex flex-col flex-none space-y-1'>
          <span className='text-muted-foreground'>Shift End</span>
          <div className='flex items-center space-x-2'>
            <Clock className='flex-none size-5' />
            <span>{shift.end}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ActionProps {
  shift: Shift;
  className?: string;
}

const Action: React.FC<ActionProps> = ({ className, shift }) => {
  const { toast } = useToast();
  const { confirm } = useConfirm();
  const { mutate } = useShifts();

  const handleDelete = async () => {
    confirm({
      variant: 'destructive',
      title: 'Delete Shift',
      description: `Are you sure you want to delete this shift? make sure the details are correct, this action
      will also delete all resources associated with this shift.`,
    }).then(async () => {
      try {
        await axios.delete('/shifts/' + shift.shift_id);
        toast({
          title: 'Shift deleted',
          description: 'Shift has been deleted successfully',
        });
        mutate();
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Failed to delete shift',
          description: error.message,
        });
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className={cn('w-8 h-8 p-0', className)}>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <EditShiftModal shift={shift} />
        <DropdownMenuItem onClick={() => handleDelete()}>Delete shift</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShiftCard;
