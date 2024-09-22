'use client';

import { Order, OrderProgress } from '@/types/order';

import { Complaint } from '@/types/complaint';
import { Outlet } from '@/types/outlet';
import { fetcher } from '@/lib/axios';
import useSWR from 'swr';
import { useToast } from './use-toast';

export const useCustomerOrders = (type: 'All' | 'Ongoing' | 'Paid' | 'Completed') => {
  const { toast } = useToast();

  return useSWR<{
    message: string;
    data: Array<
      Order & {
        Outlet?: Outlet;
        Complaint?: Complaint;
        OrderProgress: OrderProgress[];
      }
    >;
  }>(
    [
      '/profile/orders?',
      {
        params: {
          type,
        },
      },
    ],
    fetcher,
    {
      onError: (error) => {
        toast({
          title: 'Failed to fetch customer orders',
          description: error.message,
        });
      },
    }
  );
};
