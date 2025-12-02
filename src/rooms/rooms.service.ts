import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';


export interface RoomInfo {
id: string;
name?: string;
createdAt: string;
}


@Injectable()
export class RoomsService {
private rooms: Map<string, RoomInfo> = new Map();


createRoom(name?: string) {
const id = randomUUID();
const room: RoomInfo = { id, name, createdAt: new Date().toISOString() };
this.rooms.set(id, room);
return room;
}


listRooms() {
return Array.from(this.rooms.values());
}


getRoom(id: string) {
return this.rooms.get(id) || null;
}
}