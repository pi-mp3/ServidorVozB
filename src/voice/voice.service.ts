import { Injectable } from '@nestjs/common';

@Injectable()
export class VoiceService {
  private clients = new Map<string, { roomId: string; userId: string }>();

  addClientToRoom(socketId: string, roomId: string, userId: string) {
    this.clients.set(socketId, { roomId, userId });
  }

  getRoomOfClient(socketId: string): string | undefined {
    return this.clients.get(socketId)?.roomId;
  }

  removeClient(socketId: string) {
    this.clients.delete(socketId);
  }
}
