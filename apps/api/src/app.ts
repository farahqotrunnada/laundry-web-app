import '@/utils/polyfill.util';

import { FRONTEND_URL, PORT, validateEnv } from '@/config';
import express, { Express, NextFunction, Request, Response } from 'express';

import ApiError from '@/utils/error.util';
import type { Server as HttpServer } from 'http';
import PassportConfig from '@/libs/passport';
import { Prisma } from '@prisma/client';
import { Socket } from './libs/socketio';
import { ValidationError } from 'yup';
import cookie from 'cookie-parser';
import cors from 'cors';
import { createServer } from 'http';
import morgan from 'morgan';
import path from 'path';
import v1Router from '@/routers/v1/index.routes';

export default class App {
  private app: Express;
  private server: HttpServer;
  private socket: Socket;
  private passport: PassportConfig;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.socket = new Socket(this.server, {
      cors: {
        credentials: true,
        origin: FRONTEND_URL,
        allowedHeaders: ['Content-Type', 'Authorization'],
      },
    });
    this.passport = new PassportConfig();

    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(
      cors({
        credentials: true,
        origin: FRONTEND_URL,
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    );
    this.app.use(cookie());
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.socket.on('connection', (socket) => {
      socket.on('room', (room: string) => {
        socket.leaveAll();
        socket.join(room);
      });

      socket.on('disconnect', () => {
        socket.leave();
      });
    });

    this.passport.initialize();
  }

  private routes(): void {
    const v1 = new v1Router();

    this.app.use('/static', express.static(path.join(__dirname, '../public')));
    this.app.get('/_debug/healthcheck', (req: Request, res: Response) => {
      res.send('OK');
    });
    this.app.get('/test', (req: Request, res: Response) => {
      this.socket.emit('notification', {
        title: 'Success',
        description: 'This is a test notification',
        variant: Math.random() > 0.5 ? 'dangerous' : 'default',
      });

      res.send('OK');
    });

    this.app.use('/api/v1', v1.getRouter());
  }

  private handleError(): void {
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof ApiError) {
        return res.status(err.status).json({
          message: err.message,
        });
      }

      if (err instanceof ValidationError) {
        return res.status(400).json({
          ...err,
        });
      }

      console.error('Error : ', err.stack);

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(500).json({
          message: 'Internal Server Error',
        });
      }

      res.status(500).json({
        message: 'Internal Server Error',
        error: err.message,
      });
    });
  }

  public start(): void {
    validateEnv()
      .then(() => {
        this.server.listen(PORT, () => {
          console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
        });
      })
      .catch((error) => {
        console.error('Environment variables are not valid', error.message);
      });
  }
}
