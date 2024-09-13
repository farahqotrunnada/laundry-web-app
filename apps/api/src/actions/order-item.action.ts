import ApiError from '@/utils/error.util';
import { OrderProgresses } from '@/utils/constant';
import prisma from '@/libs/prisma';

interface ChoosenItem {
  name: string;
  weight: number;
  quantity: number;
  laundry_item_id: string;
}

export default class OrderItemAction {
  create = async (order_id: string, order_items: ChoosenItem[]) => {
    try {
      const order = await prisma.order.findUnique({
        where: { order_id },
        include: {
          OrderProgress: true,
        },
      });

      if (!order) throw new ApiError(404, 'Order not found');
      if (!order.OrderProgress.find((item) => item.name === OrderProgresses.ARRIVED_AT_OUTLET)) {
        throw new ApiError(400, 'Order not arrived at outlet yet');
      }

      const laundry_items = await prisma.laundryItem.findMany({
        where: {
          OR: order_items.map((item) => ({
            laundry_item_id: item.laundry_item_id,
          })),
        },
      });

      if (laundry_items.length !== order_items.length) throw new ApiError(400, 'Some laundry items not found');

      await prisma.orderItem.createMany({
        data: order_items.map((item) => ({
          order_id,
          weight: item.weight,
          quantity: item.quantity,
          laundry_item_id: item.laundry_item_id,
        })),
      });

      await prisma.orderProgress.create({
        data: {
          order_id,
          name: OrderProgresses.WAITING_FOR_PAYMENT,
        },
      });

      return order;
    } catch (error) {
      throw error;
    }
  };
}
