import { JobType, ProgressType } from '@prisma/client';

import ApiError from '@/utils/error.util';
import { OrderProgresses } from '@/utils/constant';
import { PRICE_PER_KG } from '@/config';
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
      const weigth = order_items.reduce((acc, item) => acc + item.weight, 0);

      await prisma.$transaction([
        prisma.order.update({
          where: { order_id },
          data: {
            laundry_fee: Math.ceil(weigth) * PRICE_PER_KG,
          },
        }),

        ...order_items.map((item) =>
          prisma.orderItem.create({
            data: {
              order_id,
              weight: item.weight,
              quantity: item.quantity,
              laundry_item_id: item.laundry_item_id,
            },
          })
        ),

        prisma.orderProgress.create({
          data: {
            order_id,
            name: OrderProgresses.ON_PROGRESS_WASHING,
          },
        }),

        prisma.job.create({
          data: {
            order_id,
            outlet_id: order.outlet_id,
            progress: ProgressType.Ongoing,
            type: JobType.Washing,
          },
        }),
      ]);

      return order;
    } catch (error) {
      throw error;
    }
  };
}
