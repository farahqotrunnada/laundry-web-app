import './libs/passport';

import express, { Express, json, urlencoded } from 'express';
import passport, { initialize } from 'passport';

import { AuthRouter } from './routers/auth.router';
import { CustomerRouter } from './routers/customer.router';
import { DeliveryRouter } from './routers/delivery.router';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { OrderRouter } from './routers/order.router';
import { PORT } from './config';
import { UserAddressRouter } from './routers/userAddress.router';
import { UserRouter } from './routers/user.router';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import session from 'express-session';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(
      cors({
        origin: String(process.env.FE_BASE_URL),
        credentials: true
      })
    );
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));

    this.app.use(cookieParser());

    // Setup session middleware
    this.app.use(
      session({
        secret: String(process.env.API_KEY),
        resave: false,
        saveUninitialized: true
      })
    );

    // Initialize passport
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Tambahan middleware untuk menyajikan file statis
    this.app.use('/static', express.static(path.join(__dirname, '../public')));
  }

  private handleError(): void {
    this.app.use(ErrorMiddleware);
  }

  private routes(): void {
    const routers = [
      new AuthRouter(),
      new UserRouter(),
      new UserAddressRouter(),
      new OrderRouter(),
      new CustomerRouter(),
      new DeliveryRouter()
    ];

    routers.forEach((router) => {
      this.app.use('/api', router.getRouter());
    });
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
