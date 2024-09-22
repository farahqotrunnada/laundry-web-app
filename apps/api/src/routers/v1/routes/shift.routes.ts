import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { RoleMiddleware } from '@/middlewares/role.middleware';
import { Router } from 'express';
import { ShiftController } from '@/controllers/shift.controller';

export class ShiftRouter {
  private router: Router;
  private authMiddleware: AuthMiddleware;
  private roleMiddleware: RoleMiddleware;
  private shiftController: ShiftController;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.roleMiddleware = new RoleMiddleware();
    this.shiftController = new ShiftController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(this.authMiddleware.header);
    this.router.use(this.roleMiddleware.role(['SuperAdmin']));

    this.router.get('/', this.shiftController.index);
    this.router.post('/', this.shiftController.create);
    this.router.get('/:shift_id', this.shiftController.show);
    this.router.put('/:shift_id', this.shiftController.update);
    this.router.delete('/:shift_id', this.shiftController.destroy);
  }

  getRouter() {
    return this.router;
  }
}
