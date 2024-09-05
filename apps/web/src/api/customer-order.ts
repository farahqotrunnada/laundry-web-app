import { PaginationState } from '@tanstack/react-table';
import useSWR from 'swr';
import { fetcher } from 'utils/axios';

export interface CustomerOrderListResponse {
  message: string;
  data: CustomerOrder[];
  count: number;
}

export interface CustomerOrder {
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

const useCustomerOrder = (id: string, search: string, limit: number, skip: number, date: Date | null) => {
  const params = new URLSearchParams();

  params.append('search', search);
  params.append('skip', skip.toString());
  params.append('limit', limit.toString());
  params.append('date', date ? date.toUTCString() : '');

  const { data, error, isLoading } = useSWR<CustomerOrderListResponse>(`/customers/${id}/orders?${params}`, fetcher);

  return {
    ...data,
    error,
    loading: isLoading
  };
};

export default useCustomerOrder;
