import AddressController from '@/controllers/address.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { ComplaintController } from '@/controllers/complaint.controller';
import OrderController from '@/controllers/order.controller';
import ProfileController from '@/controllers/profile.controller';
import { Router } from 'express';

export default class ProfileRouter {
  private router: Router;
  private profileController: ProfileController;
  private addressController: AddressController;
  private authMiddleware: AuthMiddleware;
  private orderController: OrderController;
  private complaintController: ComplaintController;

  constructor() {
    this.router = Router();

    this.authMiddleware = new AuthMiddleware();
    this.profileController = new ProfileController();
    this.addressController = new AddressController();
    this.orderController = new OrderController();
    this.complaintController = new ComplaintController();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.use(this.authMiddleware.header);

    this.router.get('/', this.profileController.show);
    this.router.put('/', this.profileController.update);
    this.router.post('/change-password', this.profileController.changePassword);
    this.router.post('/change-email', this.profileController.changeEmail);

    this.router.get('/orders', this.orderController.customer);
    this.router.get('/orders/:order_id', this.orderController.show);
    this.router.post('/orders/:order_id/payment', this.orderController.payment);

    this.router.get('/addresses', this.addressController.index);
    this.router.post('/addresses', this.addressController.create);
    this.router.get('/addresses/:customer_address_id', this.addressController.show);
    this.router.put('/addresses/:customer_address_id', this.addressController.update);
    this.router.delete('/addresses/:customer_address_id', this.addressController.destroy);
    this.router.put('/addresses/:customer_address_id/set-primary', this.addressController.primary);

    this.router.get('/complaints', this.complaintController.customer);
    this.router.post('/complaints', this.complaintController.create);
    this.router.put('/complaints/:complaint_id', this.complaintController.update);
    this.router.delete('/complaints/:complaint_id', this.complaintController.destroy);
  }

  getRouter(): Router {
    return this.router;
  }
}
