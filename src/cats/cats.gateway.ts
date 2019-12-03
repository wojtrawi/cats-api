import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class CatsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection() {
    this.server.on('connection', () => console.log('Connected to socket'));
  }

  notifyAll(eventName = 'newCatAvailable') {
    this.server.emit(eventName);
  }
}
