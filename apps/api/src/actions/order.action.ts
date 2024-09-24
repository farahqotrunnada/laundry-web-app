import { Prisma, Role } from '@prisma/client';

import ApiError from '@/utils/error.util';
import { Socket } from '@/libs/socketio';
import prisma from '@/libs/prisma';

export default class OrderAction {
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
      let order = {
        ['created_at' as keyof Prisma.OrderSelect]: 'desc',
      };

      console.log(order);

      if (id && value) {
        filter = {
          [id as keyof Prisma.OrderSelect]: { contains: value as string, mode: 'insensitive' },
        };
      }

      if (key && desc) {
        order = {
          [key as keyof Prisma.OrderSelect]: desc === 'true' ? 'desc' : 'asc',
        };
      }

      let query;

      if (role === 'SuperAdmin') {
        query = {
          where: filter,
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
          },
        };
      }

      const [orders, count] = await prisma.$transaction([
        prisma.order.findMany({
          ...query,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            Outlet: true,
            OrderProgress: {
              orderBy: {
                created_at: 'desc',
              },
            },
            Customer: {
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
          orderBy: order,
        } as Prisma.OrderFindManyArgs),

        prisma.order.count(query as Prisma.OrderCountArgs),
      ]);

      return [orders, count];
    } catch (error) {
      throw error;
    }
  };

  customer = async (user_id: string, type: 'All' | 'Ongoing' | 'Paid' | 'Completed' | undefined) => {
    try {
      const customer = await prisma.customer.findUnique({
        where: { user_id },
      });
      if (!customer) throw new ApiError(404, 'Customer not found');

      let filter: Prisma.OrderWhereInput | undefined;
      let order = {
        ['created_at' as keyof Prisma.OrderSelect]: 'desc',
      };

      if (type === 'Ongoing') {
        filter = {
          is_completed: false,
        };
      } else if (type === 'Paid') {
        filter = {
          Payment: {
            isNot: null,
          },
        };
      } else if (type === 'Completed') {
        filter = {
          is_completed: true,
        };
      }

      const orders = (await prisma.order.findMany({
        where: {
          customer_id: customer.customer_id,
          ...filter,
        },
        include: {
          Outlet: true,
          Complaint: true,
          OrderProgress: {
            orderBy: {
              created_at: 'desc',
            },
          },
        },
        orderBy: order,
      })) as Prisma.OrderFindManyArgs;

      return orders;
    } catch (error) {
      throw error;
    }
  };

  show = async (user_id: string, role: Role, order_id: string) => {
    try {
      const order = await prisma.order.findUnique({
        where: { order_id },
        include: {
          OrderItem: {
            include: {
              LaundryItem: true,
            },
          },
          Outlet: true,
          Customer: {
            include: {
              User: {
                select: {
                  email: true,
                  fullname: true,
                },
              },
            },
          },
          CustomerAddress: true,
          OrderProgress: true,
          Payment: true,
          Complaint: true,
        },
      });

      if (!order) throw new ApiError(404, 'Order not found');
      if (role === 'SuperAdmin') return order;

      const user = await prisma.user.findUnique({
        where: {
          user_id,
        },
        include: {
          Customer: true,
          Employee: {
            include: {
              Outlet: true,
              Job: {
                where: {
                  order_id: order.order_id,
                },
                include: {
                  RequestAccess: true,
                },
              },
            },
          },
        },
      });

      if (!user) throw new ApiError(404, 'User not found');
      if (user.Customer && order.customer_id !== user.Customer.customer_id) return order;

      if (role === 'OutletAdmin') {
        if (!user.Employee) throw new ApiError(404, 'Employee not found');
        if (!user.Employee.Outlet) throw new ApiError(404, 'Outlet not found');
        if (order.outlet_id !== user.Employee.Outlet.outlet_id) {
          throw new ApiError(404, 'Order not belong to this user');
        }
      }

      if (role === 'WashingWorker' || role === 'IroningWorker' || role === 'PackingWorker') {
        if (!user.Employee) throw new ApiError(404, 'Employee not found');
        if (!user.Employee.Outlet) throw new ApiError(404, 'Outlet not found');
        if (!user.Employee.Job || user.Employee.Job.length === 0) {
          throw new ApiError(404, 'Employee not assigned to this job');
        }

        const job = user.Employee.Job[0];
        if (!job.RequestAccess || job.RequestAccess.status !== 'Accepted') {
          throw new ApiError(404, 'Your access request to this order has not been accepted');
        }
      }

      return order;
    } catch (error) {
      throw error;
    }
  };
}
