'use client';

import { Shift } from '@/types/shift';
import { fetcher } from '@/lib/axios';
import useSWR from 'swr';
import { useToast } from './use-toast';

export const useShifts = () => {
  const { toast } = useToast();

  return useSWR<{
    message: string;
    data: Shift[];
  }>('/shifts', fetcher, {
    onError: (error) => {
      toast({
        title: 'Failed to fetch shifts',
        description: error.message,
      });
    },
  });
};
