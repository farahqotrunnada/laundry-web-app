import { JobType, OrderStatus, ProgressType } from '@prisma/client';

import ApiError from '@/utils/error.util';
import { PRICE_PER_KG } from '@/config';
import { Socket } from '@/libs/socketio';
import prisma from '@/libs/prisma';

interface ChoosenItem {
  name: string;
  quantity: number;
  laundry_item_id: string;
}

export default class OrderItemAction {
  private socket: Socket;

  constructor() {
    this.socket = Socket.getInstance();
  }

  update = async (order_id: string, order_items: ChoosenItem[], weight: number) => {
    try {
      const order = await prisma.order.findUnique({
        where: { order_id },
        include: {
          Outlet: true,
          OrderProgress: true,
          OrderItem: true,
          Payment: true,
          Customer: true,
        },
      });

      if (!order) throw new ApiError(404, 'Order not found');
      if (!order.OrderProgress.find((item) => item.status === OrderStatus.ARRIVED_AT_OUTLET)) {
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

      const is_paid = order.Payment;
      const is_update = order.OrderProgress.find((item) => item.status === OrderStatus.ON_PROGRESS_WASHING);

      const [updated, _] = await prisma.$transaction([
        prisma.order.update({
          where: { order_id },
          data: {
            weight,
            is_payable: is_paid ? false : true,
            laundry_fee: is_paid ? order.laundry_fee : Math.ceil(weight) * PRICE_PER_KG,
            OrderItem: {
              deleteMany: {
                //
              },
            },
          },
        }),

        prisma.orderItem.createMany({
          data: order_items.map((item) => ({
            order_id,
            quantity: item.quantity,
            laundry_item_id: item.laundry_item_id,
          })),
        }),
      ]);

      if (!is_update) {
        await prisma.$transaction([
          prisma.orderProgress.create({
            data: {
              order_id,
              status: OrderStatus.ON_PROGRESS_WASHING,
            },
          }),

          prisma.job.create({
            data: {
              order_id,
              outlet_id: order.outlet_id,
              progress: ProgressType.Pending,
              type: JobType.Washing,
            },
          }),
        ]);

        this.socket.emitTo(order.outlet_id, ['OutletAdmin', 'WashingWorker'], 'notification', {
          title: 'New Washing Job Created',
          description: 'New washing job has been created in your outlet, check your dashboard to accept the job',
        });

        this.socket.emitToCustomer(order.Customer.user_id, 'notification', {
          title: 'Your order has been processed at outlet.',
          description: 'It is awaiting payment, please pay off the order before the delivery.',
        });

        return updated;
      }

      return updated;
    } catch (error) {
      throw error;
    }
  };
}
