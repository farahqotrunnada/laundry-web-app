import * as yup from 'yup';

import { NextFunction, Request, Response } from 'express';

import { AccessTokenPayload } from '@/type/jwt';
import ApiResponse from '@/utils/response.util';
import PaymentAction from '@/actions/payment.action';
import { PaymentMethod } from '@prisma/client';
import { midtransStatus } from '@/type/midtrans';

export default class PaymentController {
  private paymentAction: PaymentAction;

  constructor() {
    this.paymentAction = new PaymentAction();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.user as AccessTokenPayload;

      const { order_id } = await yup
        .object({
          order_id: yup.string().required(),
        })
        .validate(req.params);

      const { method, receipt_url } = await yup
        .object({
          method: yup.string().oneOf(Object.values(PaymentMethod)).required(),
          receipt_url: yup
            .string()
            .url()
            .when('method', {
              is: (value: string) => value === PaymentMethod.Manual,
              then: (schema: yup.Schema) => schema.required(),
              otherwise: (schema: yup.Schema) => schema.notRequired(),
            }),
        })
        .validate(req.body);

      const payment = await this.paymentAction.create(user_id, order_id, method, receipt_url);

      return res.status(200).json(new ApiResponse('Your order payment created successfully', payment));
    } catch (error) {
      next(error);
    }
  };

  callback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { order_id, signature_key, status_code, transaction_status, gross_amount } = await yup
        .object({
          order_id: yup.string().required(),
          signature_key: yup.string().required(),
          status_code: yup.string().required(),
          gross_amount: yup.string().required(),
          transaction_status: yup.string().oneOf(midtransStatus).required(),
        })
        .validate(req.body);

      await this.paymentAction.callback(order_id, signature_key, status_code, gross_amount, transaction_status);

      return res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}
