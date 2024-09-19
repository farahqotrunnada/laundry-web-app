import { DeliveryType, JobType, Order, OrderStatus, Prisma, ProgressType, Role } from '@prisma/client';

import ApiError from '@/utils/error.util';
import prisma from '@/libs/prisma';

export default class JobAction {
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
          [id as keyof Prisma.JobSelect]: { contains: value as string, mode: 'insensitive' },
        };
      }

      if (key && value) {
        order = {
          [key as keyof Prisma.JobSelect]: desc === 'true' ? 'desc' : 'asc',
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
            Outlet: true,
            Order: true,
          },
        } as Prisma.JobFindManyArgs),

        prisma.job.count(query as Prisma.JobCountArgs),
      ]);

      return [jobs, count];
    } catch (error) {
      throw error;
    }
  };

  show = async (job_id: string) => {
    try {
      const job = await prisma.job.findUnique({
        where: { job_id },
        include: {
          Outlet: true,
          Order: true,
        },
      });

      if (!job) throw new ApiError(404, 'Job not found');

      return job;
    } catch (error) {
      throw error;
    }
  };

  update = async (
    user_id: string,
    role: 'SuperAdmin' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker',
    job_id: string,
    progress: ProgressType
  ) => {
    try {
      const job = await prisma.job.findUnique({
        where: { job_id },
        include: {
          Order: true,
        },
      });

      if (!job) throw new ApiError(404, 'Job not found');

      if (role !== 'SuperAdmin') {
        const jobRoleMapper = {
          WashingWorker: 'Washing',
          IroningWorker: 'Ironing',
          PackingWorker: 'Packing',
        };

        if (job.type !== jobRoleMapper[role]) {
          throw new ApiError(400, 'You are not allowed to update this job');
        }

        const employee = await prisma.employee.findUnique({
          where: {
            user_id,
            outlet_id: job.outlet_id,
          },
        });

        if (!employee) throw new ApiError(404, 'Employee not found or not assigned to this outlet');
      }

      await prisma.job.update({
        where: { job_id },
        data: { progress },
      });

      if (progress !== ProgressType.Completed) return job;

      const mapper = {
        Washing: OrderStatus.ON_PROGRESS_IRONING,
        Ironing: OrderStatus.ON_PROGRESS_PACKING,
        Packing: job.Order.is_payable ? OrderStatus.WAITING_FOR_PAYMENT : OrderStatus.ON_PROGRESS_DROPOFF,
      };

      const status = mapper[job.type];
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

      if (job.type === JobType.Packing) return job;

      await prisma.job.create({
        data: {
          order_id: job.order_id,
          outlet_id: job.outlet_id,
          progress: ProgressType.Pending,
          type: job.type === JobType.Washing ? JobType.Ironing : JobType.Packing,
        },
      });

      return job;
    } catch (error) {
      throw error;
    }
  };
}
