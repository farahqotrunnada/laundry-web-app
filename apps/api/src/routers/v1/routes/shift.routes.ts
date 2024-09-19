import { Router } from 'express';

export class ShiftRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    //
  }

  getRouter() {
    return this.router;
  }
}
