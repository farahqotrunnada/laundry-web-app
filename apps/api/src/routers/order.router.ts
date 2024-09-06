import { OrderController } from '@/controllers/order.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class OrderRouter {
  private router: Router;
  private path: string;
  private guard: AuthMiddleware;
  private controller: OrderController;

  constructor() {
    this.router = Router();
    this.path = '/orders';
    this.controller = new OrderController();
    this.guard = new AuthMiddleware();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, this.guard.verifyAccessToken, this.controller.getAllOrders);

    this.router.post(`${this.path}/pickup`, this.guard.verifyAccessToken, this.controller.pickupOrder);
    this.router.post(`${this.path}/process`, this.guard.verifyAccessToken, this.controller.processOrder);
    this.router.post(`${this.path}/pickup-request`, this.guard.verifyAccessToken, this.controller.createPickupRequest);
    this.router.post(`${this.path}/auto-confirm/:order_id`, this.guard.verifyAccessToken, this.controller.autoConfirmOrder);
  }

  getRouter(): Router {
    return this.router;
  }
}
