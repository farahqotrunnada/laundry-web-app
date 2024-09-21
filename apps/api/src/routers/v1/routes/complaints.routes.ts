import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { ComplaintController } from '@/controllers/complaint.controller';
import { RoleMiddleware } from '@/middlewares/role.middleware';
import { Router } from 'express';

export default class ComplaintRouter {
  private router: Router;
  private complaintController: ComplaintController;
  private roleMiddleware: RoleMiddleware;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.complaintController = new ComplaintController();
    this.roleMiddleware = new RoleMiddleware();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.use(this.authMiddleware.header);
    this.router.use(this.roleMiddleware.role(['SuperAdmin', 'OutletAdmin']));

    this.router.get('/', this.complaintController.index);
    this.router.get('/:complaint_id', this.complaintController.show);
    this.router.put('/:complaint_id', this.complaintController.update);
    this.router.delete('/:complaint_id', this.complaintController.destroy);
  }

  getRouter() {
    return this.router;
  }
}
