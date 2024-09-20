import * as yup from 'yup';

import { NextFunction, Request, Response } from 'express';

import { AccessTokenPayload } from '@/type/jwt';
import ApiResponse from '@/utils/response.util';
import JobAction from '@/actions/job.action';

export default class JobController {
  private jobAction: JobAction;

  constructor() {
    this.jobAction = new JobAction();
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, role } = req.user as AccessTokenPayload;

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

      const [jobs, count] = await this.jobAction.index(
        user_id,
        role as 'SuperAdmin' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker',
        page,
        limit,
        id,
        value,
        key,
        desc
      );

      return res.status(200).json(
        new ApiResponse('Jobs retrieved successfully', {
          jobs: jobs || [],
          count: count || 0,
        })
      );
    } catch (error) {
      return next(error);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, role } = req.user as AccessTokenPayload;

      const { job_id } = await yup
        .object({
          job_id: yup.string().required(),
        })
        .validate(req.params);

      const job = await this.jobAction.show(
        user_id,
        role as 'SuperAdmin' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker',
        job_id
      );

      return res.status(200).json(new ApiResponse('Job retrieved successfully', job));
    } catch (error) {
      return next(error);
    }
  };

  accept = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, role } = req.user as AccessTokenPayload;

      const { job_id } = await yup
        .object({
          job_id: yup.string().required(),
        })
        .validate(req.params);

      const delivery = await this.jobAction.accept(
        user_id,
        role as 'SuperAdmin' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker',
        job_id
      );

      return res.status(200).json(new ApiResponse('Delivery accepted successfully', delivery));
    } catch (error) {
      return next(error);
    }
  };

  confirm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, role } = req.user as AccessTokenPayload;

      const { job_id } = await yup
        .object({
          job_id: yup.string().required(),
        })
        .validate(req.params);

      const { order_items } = await yup
        .object({
          order_items: yup
            .array(
              yup
                .object({
                  name: yup.string().required(),
                  quantity: yup.number().required(),
                  laundry_item_id: yup.string().required(),
                })
                .required()
            )
            .required(),
        })
        .validate(req.body);

      const delivery = await this.jobAction.confirm(
        user_id,
        role as 'SuperAdmin' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker',
        job_id,
        order_items
      );

      return res.status(200).json(new ApiResponse('Delivery confirmed successfully', delivery));
    } catch (error) {
      return next(error);
    }
  };
}
