import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ProviderModule } from '../provider/provider.module';
// import { ProcessAppMapper } from './application/mappers/process.mapper';
import { ProcessFinder } from './application/services/process-finder.service';
import { StageFinder } from './application/services/stage-finder.service';
import { AdvanceProcessStage } from './application/use-cases/advance-process-stage';
import { CreateProcess } from './application/use-cases/create-process';
import { FindAllProcess } from './application/use-cases/find-all-process';
import { ReturnProcessStage } from './application/use-cases/return-process';
import { PROCESS_REPOSITORY } from './domain/repositories/process.repository';
import { STAGE_REPOSITORY } from './domain/repositories/stage.repository';
import { ProcessController } from './infraestructure/controllers/process.controller';
import { ProcessCreatedHandler } from './infraestructure/events/consumers/process-created.handler';
import { ProcessStageChangedHandler } from './infraestructure/events/consumers/process-stage-changed.handler';
import { InMemoryProcessRepository } from './infraestructure/persistence/repositories/in-memory-process.repository';
import { InMemoryStageRepository } from './infraestructure/persistence/repositories/in-memory-stage.repository';

@Module({
  imports: [CqrsModule, ProviderModule],
  controllers: [ProcessController],
  providers: [
    ProcessFinder,
    StageFinder,
    // ProcessAppMapper,
    CreateProcess,
    AdvanceProcessStage,
    ReturnProcessStage,
    FindAllProcess,
    {
      provide: PROCESS_REPOSITORY,
      useClass: InMemoryProcessRepository,
    },
    {
      provide: STAGE_REPOSITORY,
      useClass: InMemoryStageRepository,
    },
    ProcessCreatedHandler,
    ProcessStageChangedHandler,
  ],
})
export class ProcessModule {}
