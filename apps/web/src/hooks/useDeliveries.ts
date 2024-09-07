import { PaginationState } from '@tanstack/react-table';
import useSWR from 'swr';
import { fetcher } from 'utils/axios';

export interface Delivery {
  delivery_id: number;
  order_id: number;
  driver_id: number;
  status: 'Ongoing' | 'Completed';
  created_at: Date;
  updated_at: Date;
}

const useDeliveries = (search: string, pagination: PaginationState, date: Date | null) => {
  const params = new URLSearchParams();

  params.append('search', search);
  params.append('page', pagination.pageIndex.toString());
  params.append('limit', pagination.pageSize.toString());
  params.append('date', date ? date.toUTCString() : '');

  const { data, error, isLoading } = useSWR<{
    message: string;
    data: {
      deliveries: Delivery[];
      count: number;
    };
  }>(`/deliveries?${params}`, fetcher);

  return {
    ...data,
    error,
    loading: isLoading
  };
};

export default useDeliveries;
