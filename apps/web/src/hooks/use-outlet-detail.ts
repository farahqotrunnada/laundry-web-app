'use client';

import * as React from 'react';

import { Employee, User } from '@/types/user';

import { Outlet } from '@/types/outlet';
import { fetcher } from '@/lib/axios';
import useSWR from 'swr';
import { useToast } from '@/hooks/use-toast';

export const useOutletDetail = (outlet_id: string) => {
  const { toast } = useToast();

  const { data, error, isLoading, mutate } = useSWR<{
    message: string;
    data: Outlet & {
      Employee: Array<
        Employee & {
          User: {
            user_id: string;
            email: string;
            fullname: string;
            role: string;
          };
        }
      >;
    };
  }>('/outlets/' + outlet_id, fetcher);

  React.useEffect(() => {
    if (data) {
      toast({
        title: 'Outlet loaded',
        description: 'Your outlet has been loaded successfully',
      });
    } else if (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to load outlet',
        description: error.message,
      });
    }
  }, [data, error, toast]);

  return { data, error, isLoading, mutate };
};
