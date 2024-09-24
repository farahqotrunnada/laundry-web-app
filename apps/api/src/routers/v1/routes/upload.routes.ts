import * as yup from 'yup';

import { CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME } from '@/config';
import { NextFunction, Request, Response, Router } from 'express';

import ApiError from '@/utils/error.util';
import ApiResponse from '@/utils/response.util';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import cloudinary from '@/libs/cloundinary';

export default class UploadRoutes {
  private router: Router;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.post('/sign', this.authMiddleware.header, async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { asset_folder, eager, size, mime } = await yup
          .object({
            asset_folder: yup.string().required(),
            eager: yup.mixed().optional(),
            size: yup.number().required(),
            mime: yup.string().required(),
          })
          .validate(req.body);

        if (size > 1024 * 1024 * 1) {
          throw new ApiError(400, 'Image size should be less than 1MB');
        }

        if (!mime.startsWith('image/')) {
          throw new ApiError(400, 'Image type should be png, jpeg, jpg or gif');
        }

        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request(
          {
            timestamp: timestamp,
            asset_folder: asset_folder,
            eager,
          },
          process.env.CLOUDINARY_API_SECRET
        );

        return res.status(200).json(
          new ApiResponse('Upload Signed successfully', {
            timestamp,
            signature,
            api_key: CLOUDINARY_API_KEY,
            cloud_name: CLOUDINARY_CLOUD_NAME,
          })
        );
      } catch (error) {
        next(error);
      }
    });
  }

  getRouter() {
    return this.router;
  }
}
