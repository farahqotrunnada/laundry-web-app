import { Server, ServerOptions } from 'socket.io';

import type { Server as HttpServer } from 'http';
import { Role } from '@prisma/client';

export class Socket {
  private static instance: Socket;
  private io: Server;

  public constructor(server: HttpServer, options?: Partial<ServerOptions>) {
    this.io = new Server(server, options);
    Socket.instance = this;
  }

  public static getInstance(server?: HttpServer, options?: Partial<ServerOptions>): Socket {
    if (!Socket.instance) throw new Error('Socket is not initialized');
    return Socket.instance;
  }

  public on(event: string, callback: (data: any) => void): void {
    this.io.on(event, callback);
  }

  public emit(event: string, data: any): void {
    this.io.emit(event, data);
  }

  public emitTo(outlet_id: string, roles: Role[], event: string, data: any): void {
    const rooms = [];
    rooms.push('SuperAdmin');
    roles.forEach((role) => rooms.push(outlet_id + '-' + role));
    rooms.forEach((room) => this.io.to(room).emit(event, data));
  }

  public emitToCustomer(user_id: string, event: string, data: any): void {
    this.io.to(user_id).emit(event, data);
  }
}
