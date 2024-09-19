import * as yup from 'yup';

import { NextFunction, Request, Response } from 'express';

import ApiResponse from '@/utils/response.util';
import { OutletEmployeeAction } from '@/actions/outlet-employee.action';

export class OutletEmployeeController {
  private outletEmployeeAction: OutletEmployeeAction;

  constructor() {
    this.outletEmployeeAction = new OutletEmployeeAction();
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { outlet_id } = await yup
        .object({
          outlet_id: yup.string().required(),
        })
        .validate(req.params);

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

      const [employees, count] = await this.outletEmployeeAction.index(outlet_id, page, limit, id, value, key, desc);

      return res.status(200).json({
        message: 'Employees retrieved successfully',
        data: {
          employees: employees || [],
          count: count || 0,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { outlet_id } = await yup
        .object({
          outlet_id: yup.string().required(),
        })
        .validate(req.params);

      const { email, fullname, phone, password, role, shift_id } = await yup
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
          role: yup
            .string()
            .oneOf(['Driver', 'OutletAdmin', 'WashingWorker', 'IroningWorker', 'PackingWorker'])
            .required(),
          shift_id: yup.string().required(),
        })
        .validate(req.body);

      const employee = await this.outletEmployeeAction.create(
        outlet_id,
        email,
        fullname,
        phone,
        password,
        role,
        shift_id
      );

      return res.status(201).json(new ApiResponse('Employee created successfully', employee));
    } catch (error) {
      next(error);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { outlet_id, user_id } = await yup
        .object({
          outlet_id: yup.string().required(),
          user_id: yup.string().required(),
        })
        .validate(req.params);

      const employee = await this.outletEmployeeAction.show(outlet_id, user_id);

      return res.status(200).json(new ApiResponse('Employee retrieved successfully', employee));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { outlet_id, user_id } = await yup
        .object({
          outlet_id: yup.string().required(),
          user_id: yup.string().required(),
        })
        .validate(req.params);

      const { fullname, phone, role, shift_id } = await yup
        .object({
          fullname: yup.string().required(),
          phone: yup
            .string()
            .min(10, 'Phone number is too short')
            .max(13, 'Phone number is too long')
            .matches(/^\d+$/, 'Phone number must be a number')
            .required(),
          role: yup
            .string()
            .oneOf(['Driver', 'OutletAdmin', 'WashingWorker', 'IroningWorker', 'PackingWorker'])
            .required(),
          shift_id: yup.string().required(),
        })
        .validate(req.body);

      const employee = await this.outletEmployeeAction.update(outlet_id, user_id, fullname, phone, role, shift_id);

      return res.status(200).json(new ApiResponse('Employee updated successfully', employee));
    } catch (error) {
      next(error);
    }
  };

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { outlet_id, user_id } = await yup
        .object({
          outlet_id: yup.string().required(),
          user_id: yup.string().required(),
        })
        .validate(req.params);

      const employee = await this.outletEmployeeAction.destroy(outlet_id, user_id);

      return res.status(200).json(new ApiResponse('Employee deleted successfully', employee));
    } catch (error) {
      next(error);
    }
  };
}
