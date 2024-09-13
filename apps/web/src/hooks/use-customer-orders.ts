'use client';

import { Order, OrderProgress } from '@/types/order';

import { Outlet } from '@/types/outlet';
import React from 'react';
import { fetcher } from '@/lib/axios';
import useSWR from 'swr';
import { useToast } from './use-toast';

export const useCustomerOrders = (type: 'All' | 'Ongoing' | 'Completed') => {
  const { toast } = useToast();

  const query = new URLSearchParams();
  query.append('type', type);
  const out = query.toString();

  const { data, error, isLoading } = useSWR<{
    message: string;
    data: Array<
      Order & {
        Outlet?: Outlet;
        OrderProgress?: OrderProgress[];
      }
    >;
  }>('/profile/orders?' + out, fetcher);

  React.useEffect(() => {
    if (data) {
      toast({
        title: 'Orders loaded',
        description: data.data.length ? data.message : 'You have no orders added yet',
      });
    } else if (error) {
      toast({
        title: 'Failed to load orders',
        description: error.message,
      });
    }
  }, [data, error, toast]);

  return { data, error, isLoading };
};
