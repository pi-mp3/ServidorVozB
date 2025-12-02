import { Module } from '@nestjs/common';
import { VoiceModule } from './voice/voice.module';
import { RoomsModule } from './rooms/rooms.module';


@Module({
imports: [VoiceModule, RoomsModule],
controllers: [],
providers: []
})
export class AppModule {}