import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';


async function bootstrap() {
dotenv.config();
const app = await NestFactory.create(AppModule);
const port = process.env.PORT || 4003;
await app.listen(port, () => {
// eslint-disable-next-line no-console
console.log(`ServidorVozB escuchando en puerto ${port}`);
});
}
bootstrap();