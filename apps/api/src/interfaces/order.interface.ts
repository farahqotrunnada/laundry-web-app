export interface IOrderItem {
  item_id: number;
  quantity: number;
}

export interface ICreateOrder {
  user_id: number;
  address_id: number;
  pickup_time: Date;
  latitude: number;
  longitude: number;
}

export interface IProcessOrder {
  order_id: number;
  items: IOrderItem[];
  total_weight: number;
  total_cost: number;
}

export interface IOrderStatus {
  order_id: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}
