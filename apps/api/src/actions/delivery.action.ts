import prisma from '@/prisma';
import { DeliveryStatus } from '@prisma/client';
import moment from 'moment';

export default class DeliveryAction {
  getAllDeliveries = async (status: DeliveryStatus | undefined, skip: number, limit: number, date: Date | undefined) => {
    try {
      const deliveries = await prisma.delivery.findMany({
        where: {
          status: status ? { equals: status } : {},
          created_at: date ? { gte: moment(date).toISOString(), lte: moment(date).add(1, 'days').toISOString() } : {}
        },
        orderBy: {
          created_at: 'desc'
        },
        include: {
          Order: true
        },
        skip: skip,
        take: limit
      });

      return deliveries;
    } catch (error) {
      throw error;
    }
  };

  getTotalDeliveries = async (status: DeliveryStatus | undefined, date: Date | undefined) => {
    try {
      const deliveries = await prisma.delivery.count({
        where: {
          status: status ? { equals: status } : {},
          created_at: date ? { gte: moment(date).toISOString(), lte: moment(date).add(1, 'days').toISOString() } : {}
        }
      });

      return deliveries;
    } catch (error) {
      throw error;
    }
  };

  createDelivery = async (order_id: number, driver_id: number) => {
    try {
      const [order, driver] = await Promise.all([
        prisma.order.findUnique({
          where: { order_id },
          include: { Delivery: true }
        }),
        prisma.user.findUnique({
          where: { user_id: driver_id }
        })
      ]);

      if (!driver) {
        throw new Error('Driver not found');
      }

      if (order?.Delivery) {
        throw new Error('Order not found, or already has a delivery');
      }

      const newDelivery = await prisma.delivery.create({
        data: {
          order_id,
          driver_id
        }
      });

      return newDelivery;
    } catch (error) {
      throw error;
    }
  };

  findDeliveryById = async (delivery_id: number) => {
    try {
      const delivery = await prisma.delivery.findUnique({
        where: { delivery_id }
      });

      return delivery;
    } catch (error) {
      throw error;
    }
  };

  updateDelivery = async (delivery_id: number, status: DeliveryStatus) => {
    try {
      const updatedDelivery = await prisma.delivery.update({
        where: { delivery_id },
        data: { status }
      });

      return updatedDelivery;
    } catch (error) {
      throw error;
    }
  };

  deleteDelivery = async (delivery_id: number) => {
    try {
      const deletedDelivery = await prisma.delivery.delete({
        where: { delivery_id }
      });

      return deletedDelivery;
    } catch (error) {
      throw error;
    }
  };
}
