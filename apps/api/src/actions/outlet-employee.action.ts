import ApiError from '@/utils/error.util';
import { Prisma } from '@prisma/client';
import { generateHash } from '@/utils/encrypt.util';
import prisma from '@/libs/prisma';

export class OutletEmployeeAction {
  index = async (
    outlet_id: string,
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
        ['created_at' as keyof Prisma.UserSelect]: 'desc',
      };

      if (id && value) {
        filter = {
          [id as keyof Prisma.UserSelect]: { contains: value as string, mode: 'insensitive' },
        };
      }

      if (key && desc) {
        order = {
          [key as keyof Prisma.UserSelect]: desc === 'true' ? 'desc' : 'asc',
        };
      }

      const query = {
        where: {
          ...filter,
          Employee: {
            outlet_id: outlet_id,
          },
        },
      };

      const [users, count] = await prisma.$transaction([
        prisma.user.findMany({
          ...query,
          skip: (page - 1) * limit,
          take: limit,
          select: {
            user_id: true,
            fullname: true,
            email: true,
            phone: true,
            role: true,
            Employee: {
              include: {
                Shift: true,
              },
            },
          },
          orderBy: order,
        } as Prisma.UserFindManyArgs),

        prisma.user.count(query as Prisma.UserCountArgs),
      ]);

      return [users, count];
    } catch (error) {
      throw error;
    }
  };

  create = async (
    outlet_id: string,
    email: string,
    fullname: string,
    phone: string,
    password: string,
    role: 'Driver' | 'OutletAdmin' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker',
    shift_id: string
  ) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user) throw new ApiError(400, 'Email already used by another user');

      const shift = await prisma.shift.findFirst({
        where: {
          shift_id,
        },
      });

      if (!shift) throw new ApiError(400, 'Shift not found');

      const hashed = await generateHash(password);
      const created = await prisma.user.create({
        data: {
          email,
          fullname,
          phone,
          password: hashed,
          role: role,
          is_verified: true,
          Customer: {
            create: {
              //
            },
          },
          Employee: {
            create: {
              outlet_id,
              shift_id,
            },
          },
        },
      });

      return created;
    } catch (error) {
      throw error;
    }
  };

  show = async (outlet_id: string, user_id: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          user_id,
          Employee: {
            outlet_id,
          },
        },
        include: {
          Employee: {
            include: {
              Shift: true,
            },
          },
        },
      });

      if (!user) throw new ApiError(404, 'User not found, or not assigned to this outlet');

      return user;
    } catch (error) {
      throw error;
    }
  };

  update = async (
    outlet_id: string,
    user_id: string,
    fullname: string,
    phone: string,
    role: 'Driver' | 'OutletAdmin' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker',
    shift_id: string
  ) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          user_id,
        },
      });

      if (!user) throw new ApiError(404, 'User not found');

      const shift = await prisma.shift.findFirst({
        where: {
          shift_id,
        },
      });

      if (!shift) throw new ApiError(400, 'Shift not found');

      const updated = await prisma.user.update({
        where: {
          user_id,
          Employee: {
            outlet_id,
          },
        },
        data: {
          fullname,
          phone,
          role,
          Employee: {
            update: {
              shift_id,
            },
          },
        },
      });

      return updated;
    } catch (error) {
      throw error;
    }
  };

  destroy = async (outlet_id: string, user_id: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          user_id,
          Employee: {
            outlet_id,
          },
        },
      });

      if (!user) throw new ApiError(404, 'User not found, or not assigned to this outlet');

      const destroyed = await prisma.user.delete({
        where: {
          user_id,
        },
      });

      return destroyed;
    } catch (error) {
      throw error;
    }
  };
}
