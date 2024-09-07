import { Request, Response, NextFunction } from 'express';
import DeliveryAction from '@/actions/delivery.action';
import * as yup from 'yup';
import moment from 'moment';

export default class DeliveryController {
  private action: DeliveryAction;

  constructor() {
    this.action = new DeliveryAction();
  }

  getAllDeliveries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date, status } = await yup
        .object()
        .shape({
          date: yup
            .date()
            .transform((value, original) => (moment(original).isValid() ? value : undefined))
            .optional(),
          status: yup.string().oneOf(['Ongoing', 'Completed']).optional()
        })
        .validate(req.query);

      const { page, limit } = await yup
        .object()
        .shape({
          page: yup
            .number()
            .transform((value) => (Number.isNaN(value) ? 0 : value))
            .default(0)
            .required(),
          limit: yup
            .number()
            .transform((value) => (Number.isNaN(value) ? 10 : Math.min(value, 100)))
            .default(10)
            .required()
        })
        .validate(req.query);

      const skip = page * limit;

      const [deliveries, count] = await Promise.all([
        this.action.getAllDeliveries(status, skip, limit, date),
        this.action.getTotalDeliveries(status, date)
      ]);

      return res.status(200).json({
        message: 'Deliveries fetched successfully',
        data: deliveries,
        count: count
      });
    } catch (error) {
      next(error);
    }
  };

  createDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { order_id, driver_id } = await yup
        .object()
        .shape({
          order_id: yup.number().required(),
          driver_id: yup.number().required()
        })
        .validate(req.body);

      const delivery = await this.action.createDelivery(order_id, driver_id);

      res.status(200).json({
        message: 'Create delivery success',
        data: delivery
      });
    } catch (error) {
      next(error);
    }
  };

  getDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { delivery_id } = await yup
        .object()
        .shape({
          delivery_id: yup.number().required()
        })
        .validate(req.params);

      const delivery = await this.action.findDeliveryById(delivery_id);

      res.status(200).json({
        message: 'Get delivery success',
        data: delivery
      });
    } catch (error) {
      next(error);
    }
  };

  updateDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { delivery_id, status } = await yup
        .object()
        .shape({
          delivery_id: yup.number().required(),
          status: yup.string().oneOf(['Ongoing', 'Completed']).required()
        })
        .validate(req.params);

      const delivery = await this.action.updateDelivery(delivery_id, status);

      res.status(200).json({
        message: 'Update delivery success',
        data: delivery
      });
    } catch (error) {
      next(error);
    }
  };

  deleteDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { delivery_id } = await yup
        .object()
        .shape({
          delivery_id: yup.number().required()
        })
        .validate(req.params);

      const delivery = await this.action.deleteDelivery(delivery_id);

      res.status(200).json({
        message: 'Delete delivery success',
        data: delivery
      });
    } catch (error) {
      next(error);
    }
  };
}
