import { DeliveryType, JobType, OrderStatus, Prisma, ProgressType } from '@prisma/client';

import ApiError from '@/utils/error.util';
import prisma from '@/libs/prisma';

interface ChoosenItem {
  name: string;
  quantity: number;
  laundry_item_id: string;
}

export default class JobAction {
  index = async (
    user_id: string,
    role: 'SuperAdmin' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker',
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
          [id as keyof Prisma.JobSelect]: { contains: value as string, mode: 'insensitive' },
        };
      }

      if (key && value) {
        order = {
          [key as keyof Prisma.JobSelect]: desc === 'true' ? 'desc' : 'asc',
        };
      }

      let query;

      const mapper: Record<'WashingWorker' | 'IroningWorker' | 'PackingWorker', JobType> = {
        WashingWorker: 'Washing',
        IroningWorker: 'Ironing',
        PackingWorker: 'Packing',
      };

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
            type: mapper[role],
          },
          orderBy: order,
        };
      }

      const [jobs, count] = await prisma.$transaction([
        prisma.job.findMany({
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
        } as Prisma.JobFindManyArgs),

        prisma.job.count(query as Prisma.JobCountArgs),
      ]);

      return [jobs, count];
    } catch (error) {
      throw error;
    }
  };

  show = async (
    user_id: string,
    role: 'SuperAdmin' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker',
    job_id: string
  ) => {
    try {
      const job = await prisma.job.findUnique({
        where: {
          job_id,
        },
      });

      if (!job) throw new ApiError(404, 'Job not found');

      const mapper: Record<JobType, 'WashingWorker' | 'IroningWorker' | 'PackingWorker'> = {
        Washing: 'WashingWorker',
        Ironing: 'IroningWorker',
        Packing: 'PackingWorker',
      };

      if (role !== 'SuperAdmin') {
        const employee = await prisma.employee.findUnique({
          where: {
            user_id,
            outlet_id: job.outlet_id,
            User: {
              role: mapper[job.type],
            },
          },
        });

        if (!employee) throw new ApiError(404, 'Employee not found or not assigned to this outlet');
      }

      return job;
    } catch (error) {
      throw error;
    }
  };

  accept = async (
    user_id: string,
    role: 'SuperAdmin' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker',
    job_id: string
  ) => {
    try {
      const job = await prisma.job.findUnique({
        where: { job_id },
      });

      if (!job) throw new ApiError(404, 'Job not found');

      const mapper: Record<JobType, 'WashingWorker' | 'IroningWorker' | 'PackingWorker'> = {
        Washing: 'WashingWorker',
        Ironing: 'IroningWorker',
        Packing: 'PackingWorker',
      };

      if (role === 'SuperAdmin') {
        const updated = await prisma.job.update({
          where: { job_id },
          data: {
            progress: ProgressType.Ongoing,
          },
        });

        return updated;
      }

      const employee = await prisma.employee.findUnique({
        where: {
          user_id,
          outlet_id: job.outlet_id,
          User: {
            role: mapper[job.type],
          },
        },
      });

      if (!employee) throw new ApiError(404, 'Employee not found or not assigned to this outlet');

      const updated = await prisma.job.update({
        where: { job_id },
        data: {
          progress: ProgressType.Ongoing,
          employee_id: employee.employee_id,
        },
      });

      return updated;
    } catch (error) {
      throw error;
    }
  };

  confirm = async (
    user_id: string,
    role: 'SuperAdmin' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker',
    job_id: string,
    order_items: ChoosenItem[]
  ) => {
    try {
      const job = await prisma.job.findUnique({
        where: {
          job_id,
        },
        include: {
          Order: {
            include: {
              OrderItem: true,
            },
          },
        },
      });

      if (!job) throw new ApiError(404, 'Job not found');

      const compare = (value: ChoosenItem) => {
        const item = job.Order.OrderItem.find((item) => item.laundry_item_id === value.laundry_item_id);
        if (!item) return false;

        const quantity = item.quantity === value.quantity;
        const laundry_item_id = item.laundry_item_id === value.laundry_item_id;

        return quantity && laundry_item_id;
      };

      if (order_items.length !== job.Order.OrderItem.length || !order_items.every(compare)) {
        throw new ApiError(400, 'Inputted order items does not match with order items in the database');
      }

      const mapper: Record<JobType, 'WashingWorker' | 'IroningWorker' | 'PackingWorker'> = {
        Washing: 'WashingWorker',
        Ironing: 'IroningWorker',
        Packing: 'PackingWorker',
      };

      if (role === 'SuperAdmin') {
        await prisma.job.update({
          where: { job_id },
          data: {
            progress: ProgressType.Completed,
          },
        });
      } else {
        const employee = await prisma.employee.findUnique({
          where: {
            user_id,
            outlet_id: job.outlet_id,
            User: {
              role: mapper[job.type],
            },
          },
        });

        if (!employee) throw new ApiError(404, 'Employee not found or not assigned to this outlet');
        if (job.employee_id && employee.employee_id !== job.employee_id) {
          throw new ApiError(400, 'Employee not assigned to this job');
        }

        await prisma.job.update({
          where: { job_id },
          data: {
            progress: ProgressType.Completed,
            employee_id: employee.employee_id,
          },
        });
      }

      const statusMapper: Record<JobType, OrderStatus> = {
        Washing: OrderStatus.ON_PROGRESS_IRONING,
        Ironing: OrderStatus.ON_PROGRESS_PACKING,
        Packing: job.Order.is_payable ? OrderStatus.WAITING_FOR_PAYMENT : OrderStatus.ON_PROGRESS_DROPOFF,
      };
      const status = statusMapper[job.type];

      await prisma.orderProgress.create({
        data: {
          order_id: job.order_id,
          status: status,
        },
      });

      if (status === OrderStatus.ON_PROGRESS_DROPOFF) {
        await prisma.delivery.create({
          data: {
            order_id: job.order_id,
            outlet_id: job.outlet_id,
            progress: ProgressType.Pending,
            type: DeliveryType.Dropoff,
          },
        });
      }

      if (job.type === JobType.Packing) return;

      await prisma.job.create({
        data: {
          order_id: job.order_id,
          outlet_id: job.outlet_id,
          progress: ProgressType.Pending,
          type: job.type === JobType.Washing ? JobType.Ironing : JobType.Packing,
        },
      });
    } catch (error) {
      throw error;
    }
  };
}
