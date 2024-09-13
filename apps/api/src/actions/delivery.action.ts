import { DeliveryType, Prisma, ProgressType } from '@prisma/client';
import { MAXIMUM_RADIUS, PRICE_PER_KM } from '@/config';

import ApiError from '@/utils/error.util';
import { getDistance } from '@/utils/distance.util';
import prisma from '@/prisma';

export default class DeliveryAction {
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
          [id as keyof Prisma.DeliverySelect]: { contains: value as string },
        };
      }

      if (key && value) {
        order = {
          [key as keyof Prisma.DeliverySelect]: desc === 'true' ? 'desc' : 'asc',
        };
      }

      const query = {
        where: filter,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: order,
      };

      const [deliveries, count] = await prisma.$transaction([
        prisma.delivery.findMany(query),
        prisma.delivery.count(query),
      ]);

      return [deliveries, count];
    } catch (error) {
      throw error;
    }
  };

  show = async (delivery_id: string) => {
    try {
      const delivery = await prisma.delivery.findUnique({
        where: { delivery_id },
      });

      if (!delivery) throw new ApiError(404, 'Delivery not found');

      return delivery;
    } catch (error) {
      throw error;
    }
  };

  create = async (order_id: string, outlet_id: string, type: DeliveryType) => {
    try {
      const order = await prisma.order.findUnique({
        where: { order_id },
      });

      if (!order) throw new ApiError(404, 'Order not found');

      const outlet = await prisma.outlet.findUnique({
        where: { outlet_id },
      });

      if (!outlet) throw new ApiError(404, 'Outlet not found');

      const delivery = await prisma.delivery.create({
        data: {
          order_id,
          outlet_id,
          type: type,
        },
      });

      return delivery;
    } catch (error) {
      throw error;
    }
  };

  request = async (user_id: string, customer_address_id: string, outlet_id: string) => {
    try {
      const customer = await prisma.customer.findUnique({
        where: { user_id },
      });

      if (!customer) throw new ApiError(404, 'Customer not found for this user');

      const [customerAddress, outletAddress] = await prisma.$transaction([
        prisma.customerAdress.findUnique({
          where: {
            customer_id: customer.customer_id,
            customer_address_id,
          },
        }),
        prisma.outlet.findUnique({
          where: { outlet_id },
        }),
      ]);

      if (!customerAddress) throw new ApiError(404, 'Customer address not found or not linked to this customer');
      if (!outletAddress) throw new ApiError(404, 'Outlet not found');

      const distance = getDistance(
        Number(customerAddress.latitude),
        Number(customerAddress.longitude),
        Number(outletAddress.latitude),
        Number(outletAddress.longitude)
      );

      if (distance > MAXIMUM_RADIUS) throw new ApiError(400, 'Customer address is too far from outlet');

      await prisma.order.create({
        data: {
          customer_id: customer.customer_id,
          customer_address_id: customer_address_id,
          outlet_id,
          price: Math.ceil(distance) * PRICE_PER_KM,
          Delivery: {
            create: {
              outlet_id,
              progress: 'Pending',
              type: 'Pickup',
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  };

  update = async (delivery_id: string, progress: ProgressType) => {
    try {
      const delivery = await prisma.delivery.findUnique({
        where: { delivery_id },
      });

      if (!delivery) throw new ApiError(404, 'Delivery not found');

      await prisma.delivery.update({
        where: { delivery_id },
        data: { progress },
      });

      return delivery;
    } catch (error) {
      throw error;
    }
  };

  destroy = async (delivery_id: string) => {
    try {
      const delivery = await prisma.delivery.findUnique({
        where: { delivery_id },
      });

      if (!delivery) throw new ApiError(404, 'Delivery not found');

      await prisma.delivery.delete({
        where: { delivery_id },
      });

      return delivery;
    } catch (error) {
      throw error;
    }
  };
}
