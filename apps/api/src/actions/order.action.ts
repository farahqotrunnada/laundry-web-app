import { ICreateOrder, IOrderStatus, IProcessOrder } from '@/interfaces/order.interface';

import moment from 'moment';
import prisma from '@/prisma';

class OrderAction {
  generateTransactionId = () => {
    const numbers = Array(4)
      .fill(null)
      .map(() => Math.floor(Math.random() * 10))
      .join('');

    const letters = Array(4)
      .fill(null)
      .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
      .join('');

    return `#${numbers}${letters}`;
  };

  generateUniqueTransactionId = async () => {
    let unique = false;
    let transaction_id = '';

    while (!unique) {
      transaction_id = this.generateTransactionId();

      const existingOrder = await prisma.order.findUnique({
        where: { transaction_id }
      });

      if (!existingOrder) {
        unique = true;
      }
    }

    return transaction_id;
  };

  createPickupRequest = async (order: ICreateOrder) => {
    try {
      const { user_id, nearestOutlet, user_address_id } = order;

      const transaction_id = await this.generateUniqueTransactionId();
      const newOrder = await prisma.order.create({
        data: {
          transaction_id: transaction_id,
          customer_id: user_id,
          user_address_id: user_address_id,
          outlet_id: nearestOutlet,
          status: 'Menunggu Penjemputan Driver',
          total_weight: 0,
          total_cost: 0
        }
      });

      return newOrder;
    } catch (error) {
      throw error;
    }
  };

  pickupOrder = async (order_id: number, driver_id: number) => {
    try {
      const updatedOrder = await prisma.order.update({
        where: { order_id },
        data: {
          status: 'Laundry Sedang Menuju Outlet'
        }
      });

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  };

  processOrder = async (data: IProcessOrder) => {
    try {
      const { order_id, items, total_weight, total_cost } = data;

      const updatedOrder = await prisma.order.update({
        where: { order_id },
        data: {
          status: 'Laundry Telah Sampai Outlet',
          total_weight,
          total_cost
        }
      });

      for (const item of items) {
        await prisma.orderItem.create({
          data: {
            order_id,
            item_id: item.item_id,
            quantity: item.quantity
          }
        });
      }

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  };

  getAllOrders = async (search: string | undefined, skip: number, limit: number, date: Date | undefined) => {
    try {
      const orders = await prisma.order.findMany({
        where: {
          transaction_id: search ? { contains: search, mode: 'insensitive' } : {},
          created_at: date ? { gte: moment(date).toISOString(), lte: moment(date).add(1, 'days').toISOString() } : {}
        },
        orderBy: {
          created_at: 'desc'
        },
        include: {
          OrderItems: true,
          Payments: true
        },
        skip: skip,
        take: limit
      });

      return orders;
    } catch (error) {
      throw error;
    }
  };

  getTotalOrders = async (search: string | undefined, date: Date | undefined) => {
    try {
      const orders = await prisma.order.count({
        where: {
          transaction_id: search ? { contains: search, mode: 'insensitive' } : {},
          created_at: date ? { gte: moment(date).toISOString(), lte: moment(date).add(1, 'days').toISOString() } : {}
        }
      });

      return orders;
    } catch (error) {
      throw error;
    }
  };

  getOrdersForCustomer = async (customer_id: number, search: string | undefined, skip: number, limit: number, date: Date | undefined) => {
    try {
      const orders = await prisma.order.findMany({
        where: {
          customer_id,
          transaction_id: search ? { contains: search, mode: 'insensitive' } : {},
          created_at: date ? { gte: moment(date).toISOString(), lte: moment(date).add(1, 'days').toISOString() } : {}
        },
        orderBy: {
          created_at: 'desc'
        },
        include: {
          OrderItems: true,
          Payments: true
        },
        skip: skip,
        take: limit
      });

      return orders;
    } catch (error) {
      throw error;
    }
  };

  getTotalOrdersForCustomer = async (customer_id: number, search: string | undefined, date: Date | undefined) => {
    try {
      const orders = await prisma.order.count({
        where: {
          customer_id,
          transaction_id: search ? { contains: search, mode: 'insensitive' } : {},
          created_at: date ? { gte: moment(date).toISOString(), lte: moment(date).add(1, 'days').toISOString() } : {}
        }
      });

      return orders;
    } catch (error) {
      throw error;
    }
  };

  autoConfirmOrder = async (order_id: number) => {
    try {
      const currentTime = new Date();

      const order = await prisma.order.findUnique({
        where: { order_id },
        include: { Payments: true }
      });

      const orderTime = order?.updated_at;

      if (orderTime && currentTime.getTime() - orderTime.getTime() >= 2 * 24 * 60 * 60 * 1000) {
        const updatedOrder = await prisma.order.update({
          where: { order_id },
          data: { status: 'Laundry Telah Diterima Customer' }
        });

        return updatedOrder;
      }

      throw new Error('Auto-confirmation time has not been reached');
    } catch (error) {
      throw error;
    }
  };

  getOrderStatusList = async (customer_id: number): Promise<IOrderStatus[]> => {
    try {
      const orders = await prisma.order.findMany({
        where: { customer_id },
        select: {
          order_id: true,
          transaction_id: true,
          status: true,
          created_at: true,
          updated_at: true
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      return orders;
    } catch (error) {
      throw error;
    }
  };
}

export default new OrderAction();
