import { OrderController } from '@/controllers/order.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class CustomerRouter {
  private router: Router;
  private path: string;
  private guard: AuthMiddleware;
  private controller: OrderController;

  constructor() {
    this.router = Router();
    this.path = '/customers';
    this.controller = new OrderController();
    this.guard = new AuthMiddleware();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // this.router.get(`${this.path}/:customer_id/orders`, this.guard.verifyAccessToken, this.controller.getOrdersForCustomer);
    // this.router.get(`${this.path}/:customer_id/order-statuses`, this.guard.verifyAccessToken, this.controller.getOrderStatusList);
  }

  getRouter(): Router {
    return this.router;
  }
}
