import * as yup from 'yup';

import { NextFunction, Request, Response } from 'express';

import { AccessTokenPayload } from '@/type/jwt';
import ApiResponse from '@/utils/response.util';
import RequestAccessAction from '@/actions/request-access.action';
import { RequestStatus } from '@prisma/client';

export default class RequestAccessController {
  private requestAccessAction: RequestAccessAction;

  constructor() {
    this.requestAccessAction = new RequestAccessAction();
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

      const [requestAccesses, count] = await this.requestAccessAction.index(
        user_id,
        role as 'SuperAdmin' | 'OutletAdmin' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker',
        page,
        limit,
        id,
        value,
        key,
        desc
      );

      return res.status(200).json(
        new ApiResponse('Request accesses retrieved successfully', {
          requestAccesses: requestAccesses || [],
          count: count || 0,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, role } = req.user as AccessTokenPayload;

      const { request_access_id } = await yup
        .object({
          request_access_id: yup.string().required(),
        })
        .validate(req.params);

      const requestAccess = await this.requestAccessAction.show(
        user_id,
        role as 'SuperAdmin' | 'OutletAdmin' | 'WashingWorker' | 'IroningWorker' | 'PackingWorker',
        request_access_id
      );

      return res.status(200).json(new ApiResponse('Request access retrieved successfully', requestAccess));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.user as AccessTokenPayload;

      const { job_id, reason } = await yup
        .object({
          job_id: yup.string().required(),
          reason: yup.string().min(40).max(250).required(),
        })
        .validate(req.body);

      const requestAccess = await this.requestAccessAction.create(user_id, job_id, reason);

      return res.status(201).json(new ApiResponse('Request access created successfully', requestAccess));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, role } = req.user as AccessTokenPayload;

      const { request_access_id } = await yup
        .object({
          request_access_id: yup.string().required(),
        })
        .validate(req.params);

      const { reason, status } = await yup
        .object({
          reason: yup.string().min(40).max(250).required(),
          status: yup.string().oneOf(Object.values(RequestStatus)).required(),
        })
        .validate(req.body);

      const requestAccess = await this.requestAccessAction.update(
        user_id,
        role as 'SuperAdmin' | 'OutletAdmin',
        request_access_id,
        reason,
        status
      );

      return res.status(200).json(new ApiResponse('Request access updated successfully', requestAccess));
    } catch (error) {
      next(error);
    }
  };

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, role } = req.user as AccessTokenPayload;

      const { request_access_id } = await yup
        .object({
          request_access_id: yup.string().required(),
        })
        .validate(req.params);

      const requestAccess = await this.requestAccessAction.destroy(
        user_id,
        role as 'SuperAdmin' | 'OutletAdmin',
        request_access_id
      );

      return res.status(200).json(new ApiResponse('Request access deleted successfully', requestAccess));
    } catch (error) {
      next(error);
    }
  };
}
