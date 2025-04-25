import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Deserializer, RmqOptions, Serializer, Transport } from '@nestjs/microservices';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Logger as LoggerPino, LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module';
import { enabledCorsCustomConfig } from './config/cors.config';
import { initSwagger } from './config/swagger.config';
import { validationCustomConfig } from './config/validation-pipe.config';
import { swaggerPathMiddleware } from './shared/middleware/swagger-path.middleware';

// import { LoggingGlobalFilter } from './shared/middleware/filters/rpc-exception.filter';

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

  // const microserviceRabbit = app.connectMicroservice<MicroserviceOptions>({
  //   strategy: new AmqpTransport({
  //     url: 'amqp://admin:admin@localhost:5672',
  //     autoCreate: false,
  //     bindingKeys: ['process.created', 'process.stage.changed'],
  //     queue: 'process_events',
  //     exchange: 'flow_process.exchange',
  //     exchangeType: ExchangeType.TOPIC,
  //     avoidNoHandlerError: false,
  //   }),
  // });
  // microserviceRabbit.useGlobalPipes(validationCustomConfig);
  // microserviceRabbit.useLogger(app.get(LoggerPino));
  // microserviceRabbit.useGlobalFilters(new LoggingGlobalFilter());

  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:admin@localhost:5672'],
      queue: 'process_events',
      queueOptions: {
        durable: true,
        deadLetterExchange: 'flow_process.dlx',
        deadLetterRoutingKey: 'retry',
        wildcards: true,
      },
      noAck: false,
      prefetchCount: 1,
      isGlobalPrefetchCount: true,
      serializer: new CustomSerializer(),
      deserializer: new CustomDeserializer(),
      persistent: true,
      exchange: 'flow_process.exchange',
      routingKey: 'process.created',
    },
  });

  await app.startAllMicroservices();
  await app.listen(PORT, IP).then(() => {
    Logger.log(`Api gateway escuchando en el puerto ${PORT}`, 'Gateway');
  });
}
bootstrap();

class CustomSerializer implements Serializer {
  serialize(value: any): any {
    console.log('CustomSerializer', value);
    return value;
  }
}

class CustomDeserializer implements Deserializer {
  deserialize(value: any): any {
    if (value?.pattern) return value;

    return { data: value, pattern: value.eventName };
  }
}
