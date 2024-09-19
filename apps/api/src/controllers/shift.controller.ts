import * as yup from 'yup';

import { NextFunction, Request, Response } from 'express';

import ApiResponse from '@/utils/response.util';
import { ShiftAction } from '@/actions/shift.action';
import moment from 'moment';

export class ShiftController {
  private shiftAction: ShiftAction;

  constructor() {
    this.shiftAction = new ShiftAction();
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shifts = await this.shiftAction.index();

      return res.status(200).json(new ApiResponse('Shifts retrieved successfully', shifts));
    } catch (error) {
      return next(error);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shift_id } = await yup
        .object({
          shift_id: yup.string().required(),
        })
        .validate(req.query);

      const shift = await this.shiftAction.show(shift_id);

      return res.status(200).json(new ApiResponse('Shift retrieved successfully', shift));
    } catch (error) {
      return next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { start, end } = await yup
        .object({
          start: yup
            .string()
            .required('Start time cannot be empty')
            .test('is-time', 'Start should be a valid time', function (value) {
              return moment(value, 'HH:mm').isValid();
            }),

          end: yup
            .string()
            .required('End time cannot be empty')
            .test('is-time', 'End should be a valid time', function (value) {
              return moment(value, 'HH:mm').isValid();
            }),
        })
        .validate(req.body);

      const shift = await this.shiftAction.create(start, end);

      return res.status(201).json(new ApiResponse('Shift created successfully', shift));
    } catch (error) {
      return next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shift_id } = await yup
        .object({
          shift_id: yup.string().required(),
        })
        .validate(req.params);

      const { start, end } = await yup
        .object({
          start: yup
            .string()
            .required('Start time cannot be empty')
            .test('is-time', 'Start should be a valid time', function (value) {
              return moment(value, 'HH:mm').isValid();
            }),

          end: yup
            .string()
            .required('End time cannot be empty')
            .test('is-time', 'End should be a valid time', function (value) {
              return moment(value, 'HH:mm').isValid();
            }),
        })
        .validate(req.body);

      const shift = await this.shiftAction.update(shift_id, start, end);

      return res.status(200).json(new ApiResponse('Shift updated successfully', shift));
    } catch (error) {
      return next(error);
    }
  };

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shift_id } = await yup
        .object({
          shift_id: yup.string().required(),
        })
        .validate(req.params);

      const shift = await this.shiftAction.destroy(shift_id);

      return res.status(200).json(new ApiResponse('Shift deleted successfully', shift));
    } catch (error) {
      return next(error);
    }
  };
}
