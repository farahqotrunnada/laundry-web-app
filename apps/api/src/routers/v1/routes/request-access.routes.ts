import { AuthMiddleware } from '@/middlewares/auth.middleware';
import RequestAccessController from '@/controllers/request-access.controller';
import { RoleMiddleware } from '@/middlewares/role.middleware';
import { Router } from 'express';

export default class RequestAccessRouter {
  private router: Router;
  private requestAccessController: RequestAccessController;
  private roleMiddleware: RoleMiddleware;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.requestAccessController = new RequestAccessController();
    this.roleMiddleware = new RoleMiddleware();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.use(this.authMiddleware.header);

    this.router.use(
      this.roleMiddleware.role(['SuperAdmin', 'OutletAdmin', 'WashingWorker', 'IroningWorker', 'PackingWorker'])
    );
    this.router.get('/', this.requestAccessController.index);
    this.router.get('/:request_access_id', this.requestAccessController.show);

    this.router.post(
      '/',
      this.roleMiddleware.role(['WashingWorker', 'IroningWorker', 'PackingWorker']),
      this.requestAccessController.create
    );

    this.router.put(
      '/:request_access_id',
      this.roleMiddleware.role(['SuperAdmin', 'OutletAdmin']),
      this.requestAccessController.update
    );

    this.router.delete(
      '/:request_access_id',
      this.roleMiddleware.role(['SuperAdmin', 'OutletAdmin']),
      this.requestAccessController.destroy
    );
  }

  getRouter() {
    return this.router;
  }
}
