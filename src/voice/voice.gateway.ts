import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { VoiceService } from './voice.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class VoiceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly voiceService: VoiceService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const roomId = this.voiceService.getRoomOfClient(client.id);
    if (roomId) {
      client.leave(roomId);
      this.server.to(roomId).emit('user-disconnected', client.id);
      this.voiceService.removeClient(client.id);
    }
  }

  // Usuario quiere unirse a una sala
  @SubscribeMessage('join-room')
  handleJoinRoom(
    client: Socket,
    payload: { roomId: string; userId: string },
  ) {
    const { roomId, userId } = payload;

    this.voiceService.addClientToRoom(client.id, roomId, userId);
    client.join(roomId);

    // Notificar a todos MENOS al nuevo usuario
    client.to(roomId).emit('user-connected', {
      socketId: client.id,
      userId,
    });
  }

  // Reenviar OFFER
  @SubscribeMessage('offer')
  handleOffer(
    client: Socket,
    payload: { target: string; sdp: any; userId: string },
  ) {
    this.server.to(payload.target).emit('offer', {
      from: client.id,
      sdp: payload.sdp,
      userId: payload.userId,
    });
  }

  // Reenviar ANSWER
  @SubscribeMessage('answer')
  handleAnswer(
    client: Socket,
    payload: { target: string; sdp: any },
  ) {
    this.server.to(payload.target).emit('answer', {
      from: client.id,
      sdp: payload.sdp,
    });
  }

  // Reenviar ICE candidates
  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    client: Socket,
    payload: { target: string; candidate: RTCIceCandidate },
  ) {
    this.server.to(payload.target).emit('ice-candidate', {
      from: client.id,
      candidate: payload.candidate,
    });
  }
}
