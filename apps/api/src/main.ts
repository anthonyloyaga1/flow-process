import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyReply, FastifyRequest } from 'fastify';
import { LoggerErrorInterceptor, Logger as LoggerPino } from 'nestjs-pino';

import { AppModule } from './app.module';
import { enabledCorsCustomConfig } from './config/cors.config';
import { initSwagger } from './config/swagger.config';
import { validationCustomConfig } from './config/validation-pipe.config';
import { swaggerPathMiddleware } from './shared/middleware/swagger-path.middleware';

async function bootstrap() {
  const PORT = process.env.API_PORT ?? 5010;
  const IP = process.env.API_IP ?? '0.0.0.0';

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ trustProxy: true }));

  app.useLogger(app.get(LoggerPino));
  app.useGlobalPipes(validationCustomConfig);
  app.enableCors(enabledCorsCustomConfig);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.use((req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) => swaggerPathMiddleware(req, res, next));

  initSwagger(app);

  await app.listen(PORT, IP).then(() => {
    Logger.log(`Api gateway escuchando en el puerto ${PORT}`, 'Gateway');
  });
}
bootstrap();
