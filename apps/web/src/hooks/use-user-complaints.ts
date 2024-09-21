'use client';

import { Complaint } from '@/types/complaint';
import { fetcher } from '@/lib/axios';
import useSWR from 'swr';
import { useToast } from './use-toast';

export const useCustomerComplaints = () => {
  const { toast } = useToast();

  return useSWR<{
    message: string;
    data: Complaint[];
  }>('/profile/complaints', fetcher, {
    onError: (error) => {
      toast({
        title: 'Failed to fetch complaints',
        description: error.message,
      });
    },
  });
};
