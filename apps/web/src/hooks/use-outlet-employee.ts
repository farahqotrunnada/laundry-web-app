'use client';

import { Shift } from '@/types/shift';
import { User } from '@/types/user';
import { fetcher } from '@/lib/axios';
import useSWR from 'swr';
import { useToast } from './use-toast';

export const useOutletEmployee = (outlet_id: string, user_id: string) => {
  const { toast } = useToast();

  return useSWR<{
    message: string;
    data: User & {
      role: 'Driver' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker';
      Employee: {
        Shift?: Shift;
      };
    };
  }>(['/outlets/' + outlet_id + '/employees/' + user_id], fetcher, {
    onError: (error) => {
      toast({
        title: 'Failed to fetch employee',
        description: error.message,
      });
    },
  });
};
