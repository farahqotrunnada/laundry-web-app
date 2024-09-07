import { AuthMiddleware } from '@/middlewares/auth.middleware';
import DeliveryController from '@/controllers/delivery.controller';
import { Router } from 'express';

export class DeliveryRouter {
  private router: Router;
  private path: string;
  private guard: AuthMiddleware;
  private controller: DeliveryController;

  constructor() {
    this.router = Router();
    this.path = '/deliveries';
    this.controller = new DeliveryController();
    this.guard = new AuthMiddleware();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, this.guard.verifyAccessToken, this.controller.getAllDeliveries);
    this.router.post(`${this.path}`, this.guard.verifyAccessToken, this.controller.createDelivery);
    this.router.get(`${this.path}/:id`, this.guard.verifyAccessToken, this.controller.getDelivery);
    this.router.put(`${this.path}/:id`, this.guard.verifyAccessToken, this.controller.updateDelivery);
    this.router.delete(`${this.path}/:id`, this.guard.verifyAccessToken, this.controller.deleteDelivery);
  }

  getRouter(): Router {
    return this.router;
  }
}
