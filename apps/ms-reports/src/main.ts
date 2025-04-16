import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = 3300;
  const HOST = '172.32.4.65';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: HOST,
      port: PORT,
      retryAttempts: 5,
      retryDelay: 3000,
    },
  });

  await app.listen().then(() => console.log(`MS-REPORTS escuchando en ${HOST}:${PORT} [TCP]`));
}
void bootstrap();
