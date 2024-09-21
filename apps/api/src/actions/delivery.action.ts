import { DeliveryType, OrderStatus, Prisma, ProgressType, Role } from '@prisma/client';
import { MAXIMUM_RADIUS, PRICE_PER_KM } from '@/config';

import ApiError from '@/utils/error.util';
import { Socket } from '@/libs/socketio';
import { getDistance } from '@/utils/distance.util';
import prisma from '@/libs/prisma';

export default class DeliveryAction {
  private socket: Socket;

  constructor() {
    this.socket = Socket.getInstance();
  }

  index = async (
    user_id: string,
    role: Role,
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
          [id as keyof Prisma.DeliverySelect]: { contains: value as string, mode: 'insensitive' },
        };
      }

      if (key && value) {
        order = {
          [key as keyof Prisma.DeliverySelect]: desc === 'true' ? 'desc' : 'asc',
        };
      }

      let query;

      if (role === 'SuperAdmin') {
        query = {
          where: filter,
          orderBy: order,
        };
      } else {
        query = {
          where: {
            ...filter,
            Outlet: {
              Employee: {
                some: {
                  User: {
                    user_id,
                  },
                },
              },
            },
            OR: [
              {
                Employee: null,
              },
              {
                Employee: {
                  User: {
                    user_id,
                  },
                },
              },
            ],
          },
          orderBy: order,
        };
      }

      const [deliveries, count] = await prisma.$transaction([
        prisma.delivery.findMany({
          ...query,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            Order: true,
            Outlet: true,
            Employee: {
              include: {
                User: {
                  select: {
                    email: true,
                    fullname: true,
                  },
                },
              },
            },
          },
        } as Prisma.DeliveryFindManyArgs),

        prisma.delivery.count(query as Prisma.DeliveryCountArgs),
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

      const order = await prisma.order.create({
        data: {
          customer_id: customer.customer_id,
          customer_address_id: customer_address_id,
          outlet_id,
          laundry_fee: 0,
          delivery_fee: Math.ceil(distance) * PRICE_PER_KM,
          Delivery: {
            create: {
              outlet_id,
              progress: ProgressType.Pending,
              type: DeliveryType.Pickup,
            },
          },
          OrderProgress: {
            create: {
              status: OrderStatus.WAITING_FOR_PICKUP,
            },
          },
        },
      });

      this.socket.emitTo(order.outlet_id, ['OutletAdmin', 'Driver'], 'notification', {
        title: 'Delivery Requested',
        description: 'A new delivery has been requested in your outlet, check your dashboard to accept the delivery',
      });
    } catch (error) {
      throw error;
    }
  };

  update = async (
    user_id: string,
    role: 'SuperAdmin' | 'Driver',
    delivery_id: string,
    progress: 'Ongoing' | 'Completed'
  ) => {
    try {
      const delivery = await prisma.delivery.findUnique({
        where: {
          delivery_id,
        },
        include: {
          Order: true,
        },
      });

      if (!delivery) throw new ApiError(404, 'Delivery not found');

      if (role === 'SuperAdmin') {
        await prisma.delivery.update({
          where: { delivery_id },
          data: {
            progress,
          },
        });
      } else {
        const employee = await prisma.employee.findUnique({
          where: {
            user_id,
            outlet_id: delivery.outlet_id,
          },
          include: {
            Delivery: true,
          },
        });

        if (!employee) throw new ApiError(404, 'Employee not found or not assigned to this outlet');
        if (delivery.employee_id && employee.employee_id !== delivery.employee_id) {
          throw new ApiError(400, 'Employee not assigned to this delivery');
        }

        await prisma.delivery.update({
          where: { delivery_id },
          data: {
            progress,
            employee_id: employee.employee_id,
          },
        });
      }

      const mapper: Record<DeliveryType, Record<'Ongoing' | 'Completed', OrderStatus>> = {
        [DeliveryType.Pickup]: {
          [ProgressType.Ongoing]: OrderStatus.ON_PROGRESS_PICKUP,
          [ProgressType.Completed]: OrderStatus.ARRIVED_AT_OUTLET,
        },
        [DeliveryType.Dropoff]: {
          [ProgressType.Ongoing]: OrderStatus.ON_PROGRESS_DROPOFF,
          [ProgressType.Completed]: delivery.Order.is_payable
            ? OrderStatus.WAITING_FOR_PAYMENT
            : OrderStatus.COMPLETED_ORDER,
        },
      };

      const status = mapper[delivery.type][progress];

      const order = await prisma.order.update({
        where: { order_id: delivery.order_id },
        data: {
          is_completed: status === OrderStatus.COMPLETED_ORDER,
          OrderProgress: {
            create: {
              status,
            },
          },
        },
        include: {
          Outlet: true,
        },
      });

      if (status === OrderStatus.ARRIVED_AT_OUTLET) {
        this.socket.emitTo(order.outlet_id, ['OutletAdmin'], 'notification', {
          title: 'Order Arrived',
          description: 'Your Order has been arrived at the outlet, check your dashboard to assign the order items',
        });
      }

      if (status === OrderStatus.COMPLETED_ORDER) {
        this.socket.emitTo(order.outlet_id, ['OutletAdmin'], 'notification', {
          title: 'Order Completed',
          description: 'Your Order has been completed, check your dashboard to see the results',
        });
      }

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
