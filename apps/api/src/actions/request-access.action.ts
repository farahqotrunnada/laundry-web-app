import { Prisma, ProgressType, RequestStatus } from '@prisma/client';

import ApiError from '@/utils/error.util';
import { Socket } from '@/libs/socketio';
import prisma from '@/libs/prisma';

export default class RequestAccessAction {
  private socket: Socket;

  constructor() {
    this.socket = Socket.getInstance();
  }

  index = async (
    user_id: string,
    role: 'SuperAdmin' | 'OutletAdmin' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker',
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
        ['created_at' as keyof Prisma.RequestAccessSelect]: 'desc',
      };

      if (id && value) {
        filter = {
          [id as keyof Prisma.RequestAccessSelect]: { contains: value as string, mode: 'insensitive' },
        };
      }

      if (key && desc) {
        order = {
          [key as keyof Prisma.RequestAccessSelect]: desc === 'true' ? 'desc' : 'asc',
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
      } else {
        query = {
          where: {
            ...filter,
            Employee: {
              User: {
                user_id,
              },
            },
          },
        };
      }

      const [requestAccesses, count] = await prisma.$transaction([
        prisma.requestAccess.findMany({
          ...query,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            Job: true,
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
          orderBy: order,
        } as Prisma.RequestAccessFindManyArgs),

        prisma.requestAccess.count(query as Prisma.RequestAccessCountArgs),
      ]);

      return [requestAccesses, count];
    } catch (error) {
      throw error;
    }
  };

  show = async (
    user_id: string,
    role: 'SuperAdmin' | 'OutletAdmin' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker',
    request_access_id: string
  ) => {
    try {
      const requestAccess = await prisma.requestAccess.findUnique({
        where: {
          request_access_id,
        },
        include: {
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
      });

      if (!requestAccess) throw new ApiError(404, 'Request access not found');
      if (role === 'SuperAdmin') return requestAccess;

      const employee = await prisma.employee.findUnique({
        where: {
          user_id,
        },
        include: {
          Outlet: true,
        },
      });

      if (!employee || !employee.Outlet) throw new ApiError(404, 'Employee not found or not valid');

      if (role === 'OutletAdmin' && requestAccess.outlet_id !== employee.Outlet.outlet_id) {
        throw new ApiError(404, 'Request access does not belong to this outlet');
      }

      if (requestAccess.employee_id !== employee.employee_id) {
        throw new ApiError(404, 'Employee not found or request access does not belong to this employee');
      }

      return requestAccess;
    } catch (error) {
      throw error;
    }
  };

  create = async (user_id: string, job_id: string, reason: string) => {
    try {
      const job = await prisma.job.findUnique({
        where: {
          job_id,
          Employee: {
            User: {
              user_id,
            },
          },
        },
        include: {
          Outlet: true,
          Employee: true,
        },
      });

      if (!job || !job.employee_id) throw new ApiError(404, 'Job not found or not assigned to this user');
      if (job.progress === ProgressType.Pending) throw new ApiError(400, 'Job is has not been accepted');
      if (job.progress === ProgressType.Completed) throw new ApiError(400, 'Job is already completed');

      const duplicate = await prisma.requestAccess.findFirst({
        where: {
          job_id,
        },
      });

      if (duplicate) throw new ApiError(400, 'Request with this job id already exists');

      const requestAccess = await prisma.requestAccess.create({
        data: {
          job_id,
          reason,
          outlet_id: job.outlet_id,
          employee_id: job.employee_id,
        },
      });

      this.socket.emitTo(job.outlet_id, ['OutletAdmin'], 'notification', {
        title: 'New Request Access Created',
        description: 'New request access has been created in your outlet, check your dashboard to accept the request',
      });
      return requestAccess;
    } catch (error) {
      throw error;
    }
  };

  update = async (
    user_id: string,
    role: 'SuperAdmin' | 'OutletAdmin',
    request_access_id: string,
    reason: string,
    status: RequestStatus
  ) => {
    try {
      const requestAccess = await prisma.requestAccess.findUnique({
        where: {
          request_access_id,
        },
      });

      if (!requestAccess) throw new ApiError(404, 'Request access not found');

      if (role === 'SuperAdmin') {
        await prisma.requestAccess.update({
          where: { request_access_id },
          data: {
            reason,
            status,
          },
        });
      } else {
        const employee = await prisma.employee.findUnique({
          where: {
            user_id,
            outlet_id: requestAccess.outlet_id,
          },
        });

        if (!employee) throw new ApiError(404, 'Employee not found or request access does not belong to this outlet');

        await prisma.requestAccess.update({
          where: { request_access_id },
          data: {
            reason,
            status,
          },
        });
      }
    } catch (error) {
      throw error;
    }
  };

  destroy = async (
    user_id: string,
    role: 'SuperAdmin' | 'OutletAdmin' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker',
    request_access_id: string
  ) => {
    try {
      const requestAccess = await prisma.requestAccess.findUnique({
        where: {
          request_access_id,
        },
      });

      if (!requestAccess) throw new ApiError(404, 'Request access not found');

      if (role === 'SuperAdmin') {
        await prisma.requestAccess.delete({
          where: { request_access_id },
        });
      } else {
        const employee = await prisma.employee.findUnique({
          where: {
            user_id,
            outlet_id: requestAccess.outlet_id,
          },
        });

        if (!employee) throw new ApiError(404, 'Employee not found or request access does not belong to this outlet');

        await prisma.requestAccess.delete({
          where: { request_access_id },
        });
      }
    } catch (error) {
      throw error;
    }
  };
}
