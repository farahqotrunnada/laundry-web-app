import * as yup from 'yup';

import { NextFunction, Request, Response } from 'express';

import { AccessTokenPayload } from '@/type/jwt';
import AddressAction from '@/actions/address.action';
import ApiResponse from '@/utils/response.util';

export default class AddressController {
  private addressAction: AddressAction;

  constructor() {
    this.addressAction = new AddressAction();
  }

  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.user as AccessTokenPayload;

      const addresses = await this.addressAction.index(user_id);

      return res.status(200).json(new ApiResponse('Customer addresses retrieved successfully', addresses));
    } catch (error) {
      next(error);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.user as AccessTokenPayload;
      const { customer_address_id } = await yup
        .object({
          customer_address_id: yup.string().required(),
        })
        .validate(req.params);

      const address = await this.addressAction.show(user_id, customer_address_id);

      return res.status(200).json(new ApiResponse('Address retrieved successfully', address));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.user as AccessTokenPayload;

      const { name, address, latitude, longitude } = await yup
        .object({
          name: yup.string().required(),
          address: yup.string().required(),
          latitude: yup.number().required(),
          longitude: yup.number().required(),
        })
        .validate(req.body);

      const created = await this.addressAction.create(user_id, name, address, latitude, longitude);

      return res.status(201).json(new ApiResponse('Address created successfully', created));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.user as AccessTokenPayload;
      const { customer_address_id } = await yup
        .object({
          customer_address_id: yup.string().required(),
        })
        .validate(req.params);

      const { name, address, latitude, longitude } = await yup
        .object({
          name: yup.string().required(),
          address: yup.string().required(),
          latitude: yup.number().required(),
          longitude: yup.number().required(),
        })
        .validate(req.body);

      const updated = await this.addressAction.update(user_id, customer_address_id, name, address, latitude, longitude);

      return res.status(200).json(new ApiResponse('Address updated successfully', updated));
    } catch (error) {
      next(error);
    }
  };

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.user as AccessTokenPayload;
      const { customer_address_id } = await yup
        .object({
          customer_address_id: yup.string().required(),
        })
        .validate(req.params);

      const deleted = await this.addressAction.destroy(user_id, customer_address_id);

      return res.status(200).json(new ApiResponse('Address deleted successfully', deleted));
    } catch (error) {
      next(error);
    }
  };

  primary = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user_id } = req.user as AccessTokenPayload;
      const { customer_address_id } = await yup
        .object({
          customer_address_id: yup.string().required(),
        })
        .validate(req.params);

      const updated = await this.addressAction.primary(user_id, customer_address_id);

      return res.status(200).json(new ApiResponse('Address set as primary successfully', updated));
    } catch (error) {
      next(error);
    }
  };
}
