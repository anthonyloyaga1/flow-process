import { EVENT_BUS } from '@common/domain/event-bus';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AmqpMessageBusModule } from '@nestjstools/microservices-rabbitmq';

import { ProviderModule } from '../provider/provider.module';
import { ProcessFinder } from './application/services/process-finder.service';
import { StageFinder } from './application/services/stage-finder.service';
import { AdvanceProcessStage } from './application/use-cases/advance-process-stage';
import { CreateProcess } from './application/use-cases/create-process';
import { FindAllProcess } from './application/use-cases/find-all-process';
import { ReturnProcessStage } from './application/use-cases/return-process';
import { PROCESS_REPOSITORY } from './domain/repositories/process.repository';
import { STAGE_REPOSITORY } from './domain/repositories/stage.repository';
import { ProcessController } from './infraestructure/controllers/process.controller';
import { ProcessCreatedHandlerRabbit } from './infraestructure/events/consumers/process-created-rabbit.handler';
import { ProcessCreatedHandler } from './infraestructure/events/consumers/process-created.handler';
import { ProcessStageChangedHandler } from './infraestructure/events/consumers/process-stage-changed.handler';
import { RabbitEventBus } from './infraestructure/events/producers/event-bus/rabbit-event-bus';
import { InMemoryProcessRepository } from './infraestructure/persistence/repositories/in-memory-process.repository';
import { InMemoryStageRepository } from './infraestructure/persistence/repositories/in-memory-stage.repository';

// import { ProcessCreatedHandler } from './infraestructure/events/consumers/process-created.handler';
@Module({
  imports: [
    CqrsModule,
    ProviderModule,
    AmqpMessageBusModule.forRoot([
      {
        name: 'event.bus', // Name of your message bus
        url: 'amqp://admin:admin@localhost:5672', // Connection URL for RabbitMQ
        exchange: 'flow_process.exchange', //'my_app.exchange', // Exchange name for message delivery
      },
      // You can define multiple buses to send messages to different exchanges
    ]),
    ClientsModule.register([
      {
        name: 'PROCESS_RETRY_5S',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@localhost:5672'],
          queue: 'process_retry_5s',
          queueOptions: {
            durable: true,
            arguments: {
              'x-dead-letter-exchange': '',
              'x-dead-letter-routing-key': 'process_events',
              'x-message-ttl': 5000,
            },
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'PROCESS_RETRY_10S',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@localhost:5672'],
          queue: 'process_retry_10s',
          queueOptions: {
            durable: true,
            arguments: {
              'x-dead-letter-exchange': '',
              'x-dead-letter-routing-key': 'process_events',
              'x-message-ttl': 10000,
            },
          },
        },
      },
    ]),
  ],
  controllers: [ProcessController, ProcessCreatedHandlerRabbit],
  providers: [
    // Application Services
    ProcessFinder,
    StageFinder,

    // Use Cases
    CreateProcess,
    AdvanceProcessStage,
    ReturnProcessStage,
    FindAllProcess,

    // Repositories
    {
      provide: PROCESS_REPOSITORY,
      useClass: InMemoryProcessRepository,
    },
    {
      provide: STAGE_REPOSITORY,
      useClass: InMemoryStageRepository,
    },
    {
      provide: EVENT_BUS,
      useClass: RabbitEventBus,
    },

    // Event Handlers
    ProcessCreatedHandler,
    ProcessStageChangedHandler,
  ],
})
export class ProcessModule {}
