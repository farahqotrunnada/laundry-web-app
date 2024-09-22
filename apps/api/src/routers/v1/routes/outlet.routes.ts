import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { OutletEmployeeController } from '@/controllers/outlet-employee.controller';
import OutletsController from '@/controllers/outlets.controller';
import { RoleMiddleware } from '@/middlewares/role.middleware';
import { Router } from 'express';

export default class OutletsRouter {
  private router: Router;
  private authMiddleware: AuthMiddleware;
  private roleMiddleware: RoleMiddleware;
  private outletsController: OutletsController;
  private outletEmployeeController: OutletEmployeeController;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.roleMiddleware = new RoleMiddleware();
    this.outletsController = new OutletsController();
    this.outletEmployeeController = new OutletEmployeeController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(this.authMiddleware.header);
    this.router.get('/list', this.outletsController.list);
    this.router.get('/nearest', this.outletsController.nearest);

    this.router.use(this.roleMiddleware.role(['SuperAdmin']));
    this.router.get('/', this.outletsController.index);
    this.router.post('/', this.outletsController.create);

    this.router.get('/:outlet_id', this.outletsController.show);
    this.router.put('/:outlet_id', this.outletsController.update);
    this.router.delete('/:outlet_id', this.outletsController.destroy);

    this.router.get('/:outlet_id/employees', this.outletEmployeeController.index);
    this.router.post('/:outlet_id/employees', this.outletEmployeeController.create);
    this.router.get('/:outlet_id/employees/:user_id', this.outletEmployeeController.show);
    this.router.put('/:outlet_id/employees/:user_id', this.outletEmployeeController.update);
    this.router.delete('/:outlet_id/employees/:user_id', this.outletEmployeeController.destroy);
  }

  getRouter(): Router {
    return this.router;
  }
}
