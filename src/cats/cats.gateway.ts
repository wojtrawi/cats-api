import {
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { interval, Observable } from 'rxjs';
import { finalize, map, startWith, take } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway()
export class CatsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection() {
    this.server.on('connection', () => console.log('Connected to socket'));
  }

  @SubscribeMessage('addCat')
  addCat(@MessageBody() data: any): Observable<WsResponse<string>> {
    return interval(2000).pipe(
      map(i => ({ event: 'addCat', data: `Adding cat ${50 + i * 50}%` })),
      take(2),
      startWith({ event: 'addCat', data: 'Adding cat has started!' }),
      finalize(() => this.server.emit('newCatAvailable')),
    );
  }
}
