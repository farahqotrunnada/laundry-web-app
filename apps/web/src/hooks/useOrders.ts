import { PaginationState } from '@tanstack/react-table';
import useSWR from 'swr';
import { fetcher } from 'utils/axios';

export interface Order {
  order_id: number;
  transaction_id: string;
  customer_id: number;
  user_address_id: number;
  outlet_id: number;
  driver_id: number;
  status: string;
  total_weight: number;
  total_cost: number;
  created_at: Date;
  updated_at: Date;
  OrderItems: any[];
  Payments: any[];
}

const useOrders = (search: string, pagination: PaginationState, date: Date | null) => {
  const params = new URLSearchParams();

  params.append('search', search);
  params.append('page', pagination.pageIndex.toString());
  params.append('limit', pagination.pageSize.toString());
  params.append('date', date ? date.toUTCString() : '');

  const { data, error, isLoading } = useSWR<{
    message: string;
    data: {
      orders: Order[];
      count: number;
    };
  }>(`/orders?${params}`, fetcher);

  return {
    ...data,
    error,
    loading: isLoading
  };
};

export default useOrders;
