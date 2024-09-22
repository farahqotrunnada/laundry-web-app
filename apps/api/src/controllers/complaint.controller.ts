import * as yup from 'yup';

import { NextFunction, Request, Response } from 'express';

import { AccessTokenPayload } from '@/type/jwt';
import ApiResponse from '@/utils/response.util';
import { ComplaintAction } from '@/actions/complaint.action';

export class ComplaintController {
  private complaintAction: ComplaintAction;

  constructor() {
    this.complaintAction = new ComplaintAction();
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

      const [complaints, count] = await this.complaintAction.index(
        user_id,
        role as 'SuperAdmin' | 'OutletAdmin',
        page,
        limit,
        id,
        value,
        key,
        desc
      );

      return res.status(200).json(
        new ApiResponse('Complaints retrieved successfully', {
          complaints: complaints || [],
          count: count || 0,
        })
      );
    } catch (error) {
      return next(error);
    }
  };

  customer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.user as AccessTokenPayload;

      const complaints = await this.complaintAction.customer(user_id);

      return res.status(200).json(new ApiResponse('Complaints retrieved successfully', complaints));
    } catch (error) {
      return next(error);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, role } = req.user as AccessTokenPayload;

      const { complaint_id } = await yup
        .object({
          complaint_id: yup.string().required(),
        })
        .validate(req.params);

      const complaint = await this.complaintAction.show(user_id, role, complaint_id);

      return res.status(200).json(new ApiResponse('Complaint retrieved successfully', complaint));
    } catch (error) {
      return next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.user as AccessTokenPayload;

      const { order_id, description } = await yup
        .object({
          order_id: yup.string().required(),
          description: yup.string().min(10, 'Description is too short').max(250, 'Description is too long').required(),
        })
        .validate(req.body);

      const complaint = await this.complaintAction.create(user_id, order_id, description);

      return res.status(201).json(new ApiResponse('Complaint created successfully', complaint));
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, role } = req.user as AccessTokenPayload;

      const { complaint_id } = await yup
        .object({
          complaint_id: yup.string().required(),
        })
        .validate(req.params);

      const { description, resolution } = await yup
        .object({
          description: yup.string().min(10, 'Description is too short').max(250, 'Description is too long').required(),
          resolution: yup.string().min(10, 'Description is too short').max(250, 'Description is too long').optional(),
        })
        .validate(req.body);

      const complaint = await this.complaintAction.update(user_id, role, complaint_id, description, resolution);

      return res.status(200).json(new ApiResponse('Complaint updated successfully', complaint));
    } catch (error) {
      return next(error);
    }
  };

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, role } = req.user as AccessTokenPayload;

      const { complaint_id } = await yup
        .object({
          complaint_id: yup.string().required(),
        })
        .validate(req.params);

      const complaint = await this.complaintAction.destroy(user_id, role, complaint_id);

      return res.status(200).json(new ApiResponse('Complaint deleted successfully', complaint));
    } catch (error) {
      return next(error);
    }
  };
}
