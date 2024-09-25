import { NextFunction, Request, Response } from 'express';

import { AccessTokenPayload } from '@/type/jwt';
import ApiError from '@/utils/error.util';
import { Role } from '@prisma/client';
import { checkShift } from '@/utils/shift.util';
import moment from 'moment';
import prisma from '@/libs/prisma';

export class RoleMiddleware {
  role = (role: Role[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as AccessTokenPayload;
      if (!role.includes(user.role)) throw new ApiError(403, 'You are not authorized to access this route');
      if (user.role === 'SuperAdmin') return next();

      const employee = await prisma.employee.findUnique({
        where: {
          user_id: user.user_id,
        },
        include: {
          Shift: true,
        },
      });

      if (!employee) throw new ApiError(403, 'You are not authorized to access this route');
      if (!employee.Shift) throw new ApiError(403, 'Your shift has not been set by admin');

      const current = moment();
      const start = moment(employee.Shift.start, 'HH:mm');
      const end = moment(employee.Shift.end, 'HH:mm');

      if (!checkShift(start, end, current)) {
        const message = 'Your shift start at ' + start.format('HH:mm') + ' and end at ' + end.format('HH:mm');
        throw new ApiError(403, message);
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
}
