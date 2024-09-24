import { Prisma, Role } from '@prisma/client';

import ApiError from '@/utils/error.util';
import { Socket } from '@/libs/socketio';
import prisma from '@/libs/prisma';

export class ComplaintAction {
  private socket: Socket;

  constructor() {
    this.socket = Socket.getInstance();
  }

  index = async (
    user_id: string,
    role: 'SuperAdmin' | 'OutletAdmin',
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
        ['created_at' as keyof Prisma.ComplaintSelect]: 'desc',
      };

      if (id && value) {
        filter = {
          [id as keyof Prisma.ComplaintSelect]: { contains: value as string, mode: 'insensitive' },
        };
      }

      if (key && desc) {
        order = {
          [key as keyof Prisma.ComplaintSelect]: desc === 'true' ? 'desc' : 'asc',
        };
      }

      let query;

      if (role === 'SuperAdmin') {
        query = {
          where: filter,
        };
      } else if (role === 'OutletAdmin') {
        query = {
          where: {
            ...filter,
            Order: {
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
          },
        };
      } else {
        query = {
          where: {
            ...filter,
            Customer: {
              User: {
                user_id,
              },
            },
          },
        };
      }

      const [complaints, count] = await prisma.$transaction([
        prisma.complaint.findMany({
          ...query,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            Order: true,
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
        } as Prisma.ComplaintFindManyArgs),

        prisma.complaint.count(query as Prisma.ComplaintCountArgs),
      ]);

      return [complaints, count];
    } catch (error) {
      throw error;
    }
  };

  customer = async (user_id: string) => {
    try {
      const complaints = await prisma.complaint.findMany({
        where: {
          Customer: {
            User: {
              user_id,
            },
          },
        },
      });

      return complaints;
    } catch (error) {
      throw error;
    }
  };

  show = async (user_id: string, role: Role, complaint_id: string) => {
    try {
      const complaint = await prisma.complaint.findUnique({
        where: { complaint_id },
        include: {
          Order: {
            include: {
              Outlet: true,
            },
          },
          Customer: {
            include: {
              User: {
                select: {
                  user_id: true,
                  email: true,
                  fullname: true,
                },
              },
            },
          },
        },
      });

      if (!complaint) throw new ApiError(404, 'Complaint not found');
      if (role === 'SuperAdmin') return complaint;
      if (role === 'Customer' && user_id !== complaint.Customer.User.user_id) {
        throw new ApiError(404, 'You are not authorized to view this complaint');
      }

      const employee = await prisma.employee.findUnique({
        where: {
          user_id,
        },
        include: {
          Outlet: true,
        },
      });

      if (!employee) throw new ApiError(404, 'Employee not found');
      if (!employee.Outlet) throw new ApiError(404, 'Outlet not found');
      if (role === 'OutletAdmin' && complaint.Order.Outlet.outlet_id !== employee.Outlet.outlet_id) {
        throw new ApiError(404, 'You are not authorized to view this complaint');
      }

      return complaint;
    } catch (error) {
      throw error;
    }
  };

  create = async (user_id: string, order_id: string, description: string) => {
    try {
      const order = await prisma.order.findUnique({
        where: {
          order_id,
          is_completed: true,
          Customer: {
            user_id,
          },
        },
      });

      if (!order) throw new ApiError(404, 'Order not found, not related to this user or not completed');

      const complaint = await prisma.complaint.findUnique({
        where: {
          order_id,
        },
      });

      if (complaint) throw new ApiError(400, 'Complaint already exists for this order');

      const created = await prisma.complaint.create({
        data: {
          order_id,
          description,
          resolution: "We're sorry for the inconvenience, we will resolve this as soon as possible.",
          customer_id: order.customer_id,
        },
      });

      this.socket.emitTo(order.outlet_id, ['OutletAdmin'], 'notification', {
        title: 'Complaint Created',
        description: 'New complaint has been created in your order, check your dashboard to see the details',
      });

      return created;
    } catch (error) {
      throw error;
    }
  };

  update = async (
    user_id: string,
    role: Role,
    complaint_id: string,
    description: string,
    resolution: string | undefined
  ) => {
    try {
      const complaint = await prisma.complaint.findUnique({
        where: {
          complaint_id,
        },
        include: {
          Order: {
            include: {
              Outlet: true,
            },
          },
          Customer: {
            include: {
              User: true,
            },
          },
        },
      });

      if (!complaint) throw new ApiError(404, 'Complaint not found');
      if (user_id === complaint.Customer.User.user_id || role === 'SuperAdmin') {
        const updated = await prisma.complaint.update({
          where: { complaint_id },
          data: {
            description,
            resolution,
          },
        });

        return updated;
      }

      const employee = await prisma.employee.findUnique({
        where: {
          user_id,
        },
        include: {
          Outlet: true,
        },
      });

      if (!employee) throw new ApiError(404, 'Employee not found');
      if (!employee.Outlet) throw new ApiError(404, 'Outlet not found');
      if (complaint.Order.Outlet.outlet_id !== employee.Outlet.outlet_id) {
        throw new ApiError(404, 'You are not authorized to update this complaint');
      }

      const updated = await prisma.complaint.update({
        where: { complaint_id },
        data: {
          description,
          resolution,
        },
      });

      return updated;
    } catch (error) {
      throw error;
    }
  };

  destroy = async (user_id: string, role: Role, complaint_id: string) => {
    try {
      const complaint = await prisma.complaint.findUnique({
        where: {
          complaint_id,
        },
        include: {
          Order: {
            include: {
              Outlet: true,
            },
          },
          Customer: {
            include: {
              User: true,
            },
          },
        },
      });

      if (!complaint) throw new ApiError(404, 'Complaint not found');
      if (user_id === complaint.Customer.User.user_id || role === 'SuperAdmin') {
        const deleted = await prisma.complaint.delete({
          where: { complaint_id },
        });

        return deleted;
      }

      const employee = await prisma.employee.findUnique({
        where: {
          user_id,
        },
        include: {
          Outlet: true,
        },
      });

      if (!employee) throw new ApiError(404, 'Employee not found');
      if (!employee.Outlet) throw new ApiError(404, 'Outlet not found');
      if (complaint.Order.Outlet.outlet_id !== employee.Outlet.outlet_id) {
        throw new ApiError(404, 'You are not authorized to delete this complaint');
      }

      const deleted = await prisma.complaint.delete({
        where: { complaint_id },
      });

      return deleted;
    } catch (error) {
      throw error;
    }
  };
}
