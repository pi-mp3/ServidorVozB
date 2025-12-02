import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RoomsService, RoomInfo } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() body: { name?: string }): RoomInfo {
    return this.roomsService.createRoom(body.name);
  }

  @Get()
  list(): RoomInfo[] {
    return this.roomsService.listRooms();
  }

  @Get(':id')
  get(@Param('id') id: string): RoomInfo | undefined {
    return this.roomsService.getRoom(id);
  }
}
