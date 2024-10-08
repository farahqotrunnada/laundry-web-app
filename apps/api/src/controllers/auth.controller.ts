import * as yup from 'yup';

import { AccessTokenPayload, EmailTokenPayload, RefreshTokenPayload } from '@/type/jwt';
import { NextFunction, Request, Response } from 'express';

import ApiError from '@/utils/error.util';
import ApiResponse from '@/utils/response.util';
import AuthAction from '@/actions/auth.action';
import { FRONTEND_URL } from '@/config';
import { User } from '@prisma/client';

export default class AuthController {
  private authAction: AuthAction;

  constructor() {
    this.authAction = new AuthAction();
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = await yup
        .object({
          email: yup.string().email().required(),
          password: yup.string().required(),
        })
        .validate(req.body);

      const { access_token, refresh_token } = await this.authAction.login(email, password);

      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });

      return res.status(200).json(
        new ApiResponse('Login successful', {
          access_token,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, fullname, phone } = await yup
        .object({
          email: yup.string().email().required(),
          fullname: yup.string().min(6, 'Full name is too short').max(50, 'Full name is too long').required(),
          phone: yup
            .string()
            .min(10, 'Phone number is too short')
            .max(13, 'Phone number is too long')
            .matches(/^\d+$/, 'Phone number must be a number')
            .required(),
        })
        .validate(req.body);

      await this.authAction.register(email, fullname, phone);

      return res.status(201).json(
        new ApiResponse('Register successful, please check your email to verify your account', {
          email,
          fullname,
          phone,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = await yup
        .object({
          email: yup.string().email().required(),
        })
        .validate(req.body);

      await this.authAction.forgotPassword(email);

      return res.status(200).json(
        new ApiResponse('Password reset email sent', {
          email,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.user as EmailTokenPayload;
      const { access_token } = await this.authAction.resetPassword(user_id);

      const url = new URL(FRONTEND_URL);
      url.pathname = '/auth/set-password';
      url.searchParams.set('token', access_token);

      return res.redirect(url.toString());
    } catch (error) {
      next(error);
    }
  };

  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.user as EmailTokenPayload;
      const { access_token } = await this.authAction.verify(user_id);

      const url = new URL(FRONTEND_URL);
      url.pathname = '/auth/set-password';
      url.searchParams.set('token', access_token);

      return res.redirect(url.toString());
    } catch (error) {
      next(error);
    }
  };

  confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.user as EmailTokenPayload;
      const { access_token, refresh_token } = await this.authAction.confirmEmail(user_id);

      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });

      const url = new URL(FRONTEND_URL);
      url.pathname = '/auth/callback';
      url.searchParams.set('token', access_token);

      return res.redirect(url.toString());
    } catch (error) {
      next(error);
    }
  };

  setPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password } = await yup
        .object({
          password: yup
            .string()
            .min(10, 'Password is too short')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
            .required(),
          confirmation: yup
            .string()
            .oneOf([yup.ref('password')])
            .required(),
        })
        .validate(req.body);

      const { user_id } = req.user as AccessTokenPayload;
      const { access_token, refresh_token } = await this.authAction.setPassword(user_id, password);

      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });

      return res.status(200).json(
        new ApiResponse('Password set successfully', {
          access_token,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('refresh_token');
      return res.status(200).json(new ApiResponse('Logout successful'));
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.user as RefreshTokenPayload;

      const { access_token } = await this.authAction.refresh(user_id);

      return res.status(200).json(
        new ApiResponse('Refresh successful', {
          access_token,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  callback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as User;
      if (!user) throw new ApiError(400, 'Invalid username or password');
      if (!user.is_verified) return res.redirect(`${FRONTEND_URL}/auth/verify`);

      const { access_token, refresh_token } = await this.authAction.google(user);

      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });

      const url = new URL(FRONTEND_URL);
      url.pathname = '/auth/callback';
      url.searchParams.set('token', access_token);

      return res.redirect(url.toString());
    } catch (error) {
      next(error);
    }
  };
}
