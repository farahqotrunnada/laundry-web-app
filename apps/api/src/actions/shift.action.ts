import ApiError from '@/utils/error.util';
import { Prisma } from '@prisma/client';
import prisma from '@/libs/prisma';

export class ShiftAction {
  index = async () => {
    try {
      const shifts = await prisma.shift.findMany();

      return shifts;
    } catch (error) {
      throw error;
    }
  };

  show = async (shift_id: string) => {
    try {
      const shift = await prisma.shift.findUnique({
        where: { shift_id },
      });

      if (!shift) throw new Error('Shift not found');

      return shift;
    } catch (error) {
      throw error;
    }
  };

  create = async (start: string, end: string) => {
    try {
      const shift = await prisma.shift.findFirst({
        where: {
          start,
          end,
        },
      });

      if (shift) throw new ApiError(400, 'Shift with this start and end time already exists');

      const created = await prisma.shift.create({
        data: {
          start,
          end,
        },
      });
      return created;
    } catch (error) {
      throw error;
    }
  };

  update = async (shift_id: string, start: string, end: string) => {
    try {
      const shift = await prisma.shift.findFirst({
        where: {
          start,
          end,
        },
      });

      if (!shift) throw new ApiError(404, 'Shift with this start and end time does not exist');

      const updated = await prisma.shift.update({
        where: { shift_id },
        data: {
          start,
          end,
        },
      });

      return updated;
    } catch (error) {
      throw error;
    }
  };

  destroy = async (shift_id: string) => {
    try {
      const shift = await prisma.shift.delete({
        where: { shift_id },
      });

      return shift;
    } catch (error) {
      throw error;
    }
  };
}
