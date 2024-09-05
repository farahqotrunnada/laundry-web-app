import useSWR from 'swr';
import instance from 'utils/axiosIntance';

export interface OrderDetailResponse {
  message: string;
  data: OrderDetail[];
}

export interface OrderDetail {
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

const fetcher = (url: string) =>
  instance()
    .get(url)
    .then((res) => res.data);

const useOrderDetail = (id: string) => {
  const { data, error, isLoading } = useSWR<OrderDetailResponse>(
    '/customers/' + id + '/orders',
    fetcher,
  );

  return {
    data: data?.data,
    error,
    isLoading,
  };
};

export default useOrderDetail;
