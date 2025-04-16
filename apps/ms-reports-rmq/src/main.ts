import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = 3300;
  const HOST = '172.32.4.65';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@localhost:5672'], // 🔥 Usuario y contraseña
      queue: 'default',
      queueOptions: { durable: true },
    },
  });

  await app.listen().then(() => console.log(`ms-reports-rmq escuchando en ${HOST}:${PORT} [TCP]`));
}
void bootstrap();
