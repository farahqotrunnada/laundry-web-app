'use client';

import * as React from 'react';

import { LaundryItem } from '@/types/laundry-item';
import { fetcher } from '@/lib/axios';
import useSWR from 'swr';
import { useToast } from '@/hooks/use-toast';

export const useLaundryItems = () => {
  const { toast } = useToast();

  const { data, error, isLoading } = useSWR<{
    message: string;
    data: LaundryItem[];
  }>('/laundry-items', fetcher);

  React.useEffect(() => {
    if (data) {
      toast({
        title: 'Laundry Items loaded',
        description: 'Your laundry items have been loaded successfully',
      });
    } else if (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to load laundry items',
        description: error.message,
      });
    }
  }, [data, error, toast]);

  return { data, error, isLoading };
};
