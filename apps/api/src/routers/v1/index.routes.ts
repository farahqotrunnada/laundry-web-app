import AuthRouter from '@/routers/v1/routes/auth.routes';
import ComplaintRouter from './routes/complaints.routes';
import DashboardRouter from './routes/dashboard.routes';
import DeliveryRouter from './routes/delivery.routes';
import JobRouter from './routes/job.routes';
import LaundryItemRouter from './routes/laundry-item.routes';
import OrderRouter from './routes/order.routes';
import OutletsRouter from './routes/outlet.routes';
import PaymentRouter from './routes/payment.routes';
import ProfileRouter from '@/routers/v1/routes/profile.routes';
import RequestAccessRouter from './routes/request-access.routes';
import { Router } from 'express';
import { ShiftRouter } from './routes/shift.routes';
import UploadRouter from './routes/upload.routes';
import userRouter from './routes/user.routes';

export default class IndexRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const routes = {
      auth: new AuthRouter(),
      users: new userRouter(),
      profile: new ProfileRouter(),
      outlets: new OutletsRouter(),
      orders: new OrderRouter(),
      deliveries: new DeliveryRouter(),
      laundryItems: new LaundryItemRouter(),
      jobs: new JobRouter(),
      upload: new UploadRouter(),
      shift: new ShiftRouter(),
      requestAccesses: new RequestAccessRouter(),
      complaints: new ComplaintRouter(),
      dashboard: new DashboardRouter(),
      payment: new PaymentRouter(),
    };

    this.router.use('/auth', routes.auth.getRouter());
    this.router.use('/users', routes.users.getRouter());
    this.router.use('/profile', routes.profile.getRouter());
    this.router.use('/outlets', routes.outlets.getRouter());
    this.router.use('/orders', routes.orders.getRouter());
    this.router.use('/deliveries', routes.deliveries.getRouter());
    this.router.use('/laundry-items', routes.laundryItems.getRouter());
    this.router.use('/jobs', routes.jobs.getRouter());
    this.router.use('/upload', routes.upload.getRouter());
    this.router.use('/shifts', routes.shift.getRouter());
    this.router.use('/request-accesses', routes.requestAccesses.getRouter());
    this.router.use('/complaints', routes.complaints.getRouter());
    this.router.use('/dashboard', routes.dashboard.getRouter());
    this.router.use('/payments', routes.payment.getRouter());
  }

  getRouter(): Router {
    return this.router;
  }
}
