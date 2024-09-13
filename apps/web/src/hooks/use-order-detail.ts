'use client';

import * as React from 'react';

import { Customer, User } from '@/types/user';
import { Order, OrderItem, OrderProgress } from '@/types/order';

import { LaundryItem } from '@/types/laundry-item';
import { Outlet } from '@/types/outlet';
import { fetcher } from '@/lib/axios';
import useSWR from 'swr';
import { useToast } from '@/hooks/use-toast';

export const useOrderDetail = (order_id: string) => {
  const { toast } = useToast();

  const { data, error, isLoading } = useSWR<{
    message: string;
    data: Order & {
      OrderItem: Array<
        OrderItem & {
          LaundryItem: LaundryItem;
        }
      >;
      Outlet: Outlet;
      Customer: Customer & {
        User: User;
      };
      OrderProgress: OrderProgress[];
    };
  }>('/orders/' + order_id, fetcher);

  React.useEffect(() => {
    if (data) {
      toast({
        title: 'Order loaded',
        description: 'Your order has been loaded successfully',
      });
    } else if (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to load order',
        description: error.message,
      });
    }
  }, [data, error, toast]);

  return { data, error, isLoading };
};
