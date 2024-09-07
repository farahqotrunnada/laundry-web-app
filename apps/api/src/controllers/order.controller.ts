import * as yup from 'yup';

import { ICreateOrder, IProcessOrder } from '@/interfaces/order.interface';
import { NextFunction, Request, Response } from 'express';

import OrderAction from '@/actions/order.action';
import moment from 'moment';

export class OrderController {
  createPickupRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id, user_address_id, nearestOutlet }: ICreateOrder = req.body;

      const newOrder = await OrderAction.createPickupRequest({
        user_id,
        user_address_id,
        nearestOutlet
      });

      return res.status(201).json({
        message: 'Pickup request created successfully',
        data: newOrder
      });
    } catch (error) {
      next(error);
    }
  };

  pickupOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { order_id, driver_id } = req.body;

      const updatedOrder = await OrderAction.pickupOrder(order_id, driver_id);

      return res.status(200).json({
        message: 'Order picked up successfully',
        data: updatedOrder
      });
    } catch (error) {
      next(error);
    }
  };

  processOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { order_id, items, total_weight, total_cost }: IProcessOrder = req.body;

      const updatedOrder = await OrderAction.processOrder({
        order_id,
        items,
        total_weight,
        total_cost
      });

      return res.status(200).json({
        message: 'Order processed successfully',
        data: updatedOrder
      });
    } catch (error) {
      next(error);
    }
  };

  getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, date, page, limit } = await yup
        .object()
        .shape({
          search: yup.string().optional(),
          date: yup
            .date()
            .transform((value, original) => (moment(original).isValid() ? value : undefined))
            .optional(),
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

      const skip = Math.max(page, 0) * limit;

      const [orders, count] = await Promise.all([
        OrderAction.getAllOrders(search, skip, limit, date),
        OrderAction.getTotalOrders(search, date)
      ]);

      return res.status(200).json({
        message: 'Orders fetched successfully',
        data: {
          orders,
          count
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getOrdersForCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customer_id } = await yup
        .object()
        .shape({
          customer_id: yup.number().required()
        })
        .validate(req.params);

      const { search, date, page, limit } = await yup
        .object()
        .shape({
          search: yup.string().optional(),
          date: yup
            .date()
            .transform((value, original) => (moment(original).isValid() ? value : undefined))
            .optional(),
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

      const skip = Math.max(page, 0) * limit;

      const [orders, count] = await Promise.all([
        OrderAction.getOrdersForCustomer(customer_id, search, skip, limit, date),
        OrderAction.getTotalOrdersForCustomer(customer_id, search, date)
      ]);

      return res.status(200).json({
        message: 'Orders fetched successfully',
        data: {
          orders,
          count
        }
      });
    } catch (error) {
      next(error);
    }
  };

  autoConfirmOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { order_id } = req.params;

      const updatedOrder = await OrderAction.autoConfirmOrder(Number(order_id));

      return res.status(200).json({
        message: 'Order auto-confirmed successfully',
        data: updatedOrder
      });
    } catch (error) {
      next(error);
    }
  };

  getOrderStatusList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customer_id } = req.params;

      const orderStatuses = await OrderAction.getOrderStatusList(Number(customer_id));

      return res.status(200).json({
        message: 'Order statuses fetched successfully',
        data: orderStatuses
      });
    } catch (error) {
      next(error);
    }
  };
}
