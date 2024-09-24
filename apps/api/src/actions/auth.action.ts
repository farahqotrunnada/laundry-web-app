import { comparePasswords, generateAccessToken, generateHash, generateRefreshToken } from '@/utils/encrypt.util';

import ApiError from '@/utils/error.util';
import EmailAction from '@/actions/email.action';
import { User } from '@prisma/client';
import moment from 'moment';
import prisma from '@/libs/prisma';

export default class AuthAction {
  private emailAction: EmailAction;

  constructor() {
    this.emailAction = new EmailAction();
  }

  login = async (email: string, password: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) throw new ApiError(400, 'Invalid email or password');
      if (!user.password || !user.is_verified) {
        throw new ApiError(400, 'Your account is not verified, please verify your email first');
      }

      const valid = await comparePasswords(password, user.password);
      if (!valid) throw new ApiError(400, 'Invalid email or password');

      if (user.role !== 'Customer' && user.role !== 'SuperAdmin') {
        const employee = await prisma.employee.findUnique({
          where: {
            user_id: user.user_id,
          },
          include: {
            Shift: true,
          },
        });

        if (!employee) throw new ApiError(400, 'Your shift has not been set by admin');
        if (!employee.Shift) throw new ApiError(400, 'Your shift has not been set by admin');

        const current = moment();
        const start = moment(employee.Shift.start, 'HH:mm');
        const end = moment(employee.Shift.end, 'HH:mm');

        if (!current.isBetween(start, end)) {
          throw new ApiError(
            400,
            'Your shift start at ' + start.format('HH:mm') + ' and end at ' + end.format('HH:mm')
          );
        }
      }

      const access_token = generateAccessToken({
        user_id: user.user_id,
        fullname: user.fullname,
        email: user.email,
        avatar_url: user.avatar_url,
        role: user.role,
        is_verified: user.is_verified,
      });

      const refresh_token = generateRefreshToken({
        user_id: user.user_id,
        email: user.email,
      });

      return { access_token, refresh_token };
    } catch (error) {
      throw error;
    }
  };

  register = async (email: string, fullname: string, phone: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) throw new ApiError(400, 'Email already exists');

      const created = await prisma.user.create({
        data: {
          email,
          fullname,
          phone,
        },
      });

      await this.emailAction.sendVerificationEmail(created);
    } catch (error) {
      throw error;
    }
  };

  forgotPassword = async (email: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) throw new ApiError(404, 'User not found');

      await this.emailAction.sendForgotPasswordEmail(user);
    } catch (error) {
      throw error;
    }
  };

  resetPassword = async (user_id: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { user_id },
      });

      if (!user) throw new ApiError(404, 'User not found');

      const access_token = generateAccessToken({
        user_id: user.user_id,
        fullname: user.fullname,
        email: user.email,
        avatar_url: user.avatar_url,
        role: user.role,
        is_verified: user.is_verified,
      });

      return { access_token };
    } catch (error) {
      throw error;
    }
  };

  verify = async (user_id: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { user_id },
      });
      if (!user) throw new ApiError(404, 'User not found');

      user.is_verified = true;
      const updated = await prisma.user.update({
        where: { user_id: user.user_id },
        data: { is_verified: true },
      });

      const access_token = generateAccessToken({
        user_id: updated.user_id,
        fullname: updated.fullname,
        email: updated.email,
        avatar_url: updated.avatar_url,
        role: updated.role,
        is_verified: updated.is_verified,
      });

      return { access_token };
    } catch (error) {
      throw error;
    }
  };

  confirmEmail = async (user_id: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { user_id },
      });

      if (!user) throw new ApiError(404, 'User not found');

      user.is_verified = true;
      const updated = await prisma.user.update({
        where: { user_id: user.user_id },
        data: { is_verified: true },
      });

      const access_token = generateAccessToken({
        user_id: updated.user_id,
        fullname: updated.fullname,
        email: updated.email,
        avatar_url: updated.avatar_url,
        role: updated.role,
        is_verified: updated.is_verified,
      });

      const refresh_token = generateRefreshToken({
        user_id: updated.user_id,
        email: updated.email,
      });

      return { access_token, refresh_token };
    } catch (error) {
      throw error;
    }
  };

  setPassword = async (user_id: string, password: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { user_id },
        include: {
          Customer: true,
        },
      });

      if (!user) throw new ApiError(404, 'User not found');

      const hashed = await generateHash(password);
      await prisma.user.update({
        where: { user_id: user_id },
        data: { password: hashed },
      });

      if (!user.Customer) {
        await prisma.customer.create({
          data: {
            user_id,
          },
        });
      }

      const access_token = generateAccessToken({
        user_id: user.user_id,
        fullname: user.fullname,
        email: user.email,
        avatar_url: user.avatar_url,
        role: user.role,
        is_verified: user.is_verified,
      });

      const refresh_token = generateRefreshToken({
        user_id: user.user_id,
        email: user.email,
      });

      return { access_token, refresh_token };
    } catch (error) {
      throw error;
    }
  };

  refresh = async (user_id: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { user_id },
      });

      if (!user) throw new ApiError(404, 'User not found');

      const access_token = generateAccessToken({
        user_id: user.user_id,
        fullname: user.fullname,
        email: user.email,
        avatar_url: user.avatar_url,
        role: user.role,
        is_verified: user.is_verified,
      });

      const refresh_token = generateRefreshToken({
        user_id: user.user_id,
        email: user.email,
      });

      return { access_token, refresh_token };
    } catch (error) {
      throw error;
    }
  };

  google = async (user: User) => {
    try {
      const access_token = generateAccessToken({
        user_id: user.user_id,
        fullname: user.fullname,
        email: user.email,
        avatar_url: user.avatar_url,
        role: user.role,
        is_verified: user.is_verified,
      });

      const refresh_token = generateRefreshToken({
        user_id: user.user_id,
        email: user.email,
      });

      return { access_token, refresh_token };
    } catch (error) {
      throw error;
    }
  };
}
