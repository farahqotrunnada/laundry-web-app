import * as yup from 'yup';

import { NextFunction, Request, Response } from 'express';

import ApiResponse from '@/utils/response.util';
import { Role } from '@prisma/client';
import UserAction from '@/actions/users.action';

export default class UsersController {
  private userAction: UserAction;

  constructor() {
    this.userAction = new UserAction();
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, id, value, key, desc } = await yup
        .object({
          page: yup
            .number()
            .transform((value) => (Number.isNaN(value) ? 1 : value))
            .min(1)
            .required(),
          limit: yup
            .number()
            .transform((value) => (Number.isNaN(value) ? 10 : value))
            .min(1)
            .max(100)
            .required(),
          id: yup.string().optional(),
          value: yup.string().optional(),
          key: yup.string().optional(),
          desc: yup.string().optional(),
        })
        .validate(req.query);

      const [users, count] = await this.userAction.index(page, limit, id, value, key, desc);

      return res.status(200).json({
        message: 'Users retrieved successfully',
        data: {
          users: users || [],
          count: count || 0,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = await yup
        .object({
          user_id: yup.string().required(),
        })
        .validate(req.query);

      const user = await this.userAction.show(user_id);

      return res.status(200).json(new ApiResponse('User retrieved successfully', user));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, fullname, phone, password } = await yup
        .object({
          email: yup.string().email().required(),
          fullname: yup.string().required(),
          phone: yup
            .string()
            .min(10, 'Phone number is too short')
            .max(13, 'Phone number is too long')
            .matches(/^\d+$/, 'Phone number must be a number')
            .required(),
          password: yup
            .string()
            .min(10, 'Password is too short')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
            .required(),
        })
        .validate(req.body);

      const user = await this.userAction.create(email, fullname, phone, password);

      return res.status(201).json(new ApiResponse('User created successfully', user));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = await yup
        .object({
          user_id: yup.string().required(),
        })
        .validate(req.query);

      const { fullname, phone, role, is_verified, avatar_url } = await yup
        .object({
          fullname: yup.string().required(),
          phone: yup
            .string()
            .min(10, 'Phone number is too short')
            .max(13, 'Phone number is too long')
            .matches(/^\d+$/, 'Phone number must be a number')
            .required(),
          role: yup.string().oneOf(Object.values(Role)).required(),
          is_verified: yup.boolean().required(),
          avatar_url: yup.string().nullable(),
        })
        .validate(req.body);

      const user = await this.userAction.update(user_id, fullname, phone, role, is_verified, avatar_url);

      return res.status(200).json(new ApiResponse('User updated successfully', user));
    } catch (error) {
      next(error);
    }
  };

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = await yup
        .object({
          user_id: yup.string().required(),
        })
        .validate(req.query);

      const user = await this.userAction.destroy(user_id);

      return res.status(200).json(new ApiResponse('User deleted successfully', user));
    } catch (error) {
      next(error);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { query } = await yup
        .object({
          query: yup.string().optional(),
        })
        .validate(req.query);

      const users = await this.userAction.search(query);

      return res.status(200).json(new ApiResponse('Users retrieved successfully', users));
    } catch (error) {
      next(error);
    }
  };
}
