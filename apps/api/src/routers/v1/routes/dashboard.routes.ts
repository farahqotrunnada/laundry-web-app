import * as yup from 'yup';

import { NextFunction, Request, Response, Router } from 'express';

import { AccessTokenPayload } from '@/type/jwt';
import ApiResponse from '@/utils/response.util';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { DashboardAction } from '@/actions/dashboard.action';

export default class DashboardRouter {
  private router: Router;
  private authMiddleware: AuthMiddleware;
  private dashboardAction: DashboardAction;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.dashboardAction = new DashboardAction();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(this.authMiddleware.header);
    this.router.get('/data', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { user_id, role } = req.user as AccessTokenPayload;

        const { outlet_id } = await yup
          .object({
            outlet_id: yup.string().optional(),
          })
          .validate(req.query);

        const data = await this.dashboardAction.index(user_id, role, outlet_id);

        return res.status(200).json(new ApiResponse('Dashboard retrieved successfully', data));
      } catch (error) {
        return next(error);
      }
    });
  }

  getRouter(): Router {
    return this.router;
  }
}
