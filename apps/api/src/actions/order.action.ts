import ApiError from '@/utils/error.util';
import { Prisma } from '@prisma/client';
import prisma from '@/libs/prisma';

export default class OrderAction {
  index = async (
    page: number,
    limit: number,
    id: string | undefined,
    value: string | undefined,
    key: string | undefined,
    desc: string | undefined
  ) => {
    try {
      let filter;
      let order;

      if (id && value) {
        filter = {
          [id as keyof Prisma.OrderSelect]: { contains: value as string, mode: 'insensitive' },
        };
      }

      if (key && desc) {
        order = [
          {
            [key as keyof Prisma.OrderSelect]: desc === 'true' ? 'desc' : 'asc',
          },
        ];
      }

      const query = {
        where: filter,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: order,
      };

      const [orders, count] = await prisma.$transaction([
        prisma.order.findMany({
          ...query,
          include: {
            Outlet: true,
            OrderProgress: {
              orderBy: {
                created_at: 'desc',
              },
            },
            Customer: {
              include: {
                User: true,
              },
            },
          },
        }),
        prisma.order.count(query),
      ]);

      return [orders, count];
    } catch (error) {
      throw error;
    }
  };

  customer = async (
    user_id: string,
    page: number,
    limit: number,
    id: string | undefined,
    value: string | undefined,
    key: string | undefined,
    desc: string | undefined
  ) => {
    try {
      let filter;
      let order;

      if (id && value) {
        filter = {
          [id as keyof Prisma.OrderSelect]: { contains: value as string, mode: 'insensitive' },
        };
      }

      if (key && desc) {
        order = [
          {
            [key as keyof Prisma.OrderSelect]: desc === 'true' ? 'desc' : 'asc',
          },
        ];
      }

      const customer = await prisma.customer.findUnique({
        where: { user_id },
      });

      if (!customer) throw new ApiError(404, 'Customer not found');

      const query = {
        where: filter
          ? {
              AND: [
                {
                  customer_id: customer.customer_id,
                },
                filter,
              ],
            }
          : { customer_id: customer.customer_id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: order,
      };

      const [orders, count] = await prisma.$transaction([prisma.order.findMany(query), prisma.order.count(query)]);

      return [orders, count];
    } catch (error) {
      throw error;
    }
  };

  show = async (order_id: string) => {
    try {
      const order = await prisma.order.findUnique({
        where: { order_id },
      });

      if (!order) throw new ApiError(404, 'Order not found');

      return order;
    } catch (error) {
      throw error;
    }
  };
}
