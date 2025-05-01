import { Module } from '@nestjs/common';

import { CreateProcessStageHistoryUseCase } from './application/use-cases/create-process-stage-history';
import { FindAllProcessStageHistoryUseCase } from './application/use-cases/find-all-process-stage-history';
import { PROCESS_STAGE_HISTORY_REPOSITORY } from './domain/repositories/process-stage-history.repository';
import { ProcessStageHistoryController } from './infraestructure/controllers/process-stage-history.controller';
import { ProcessStageHistoryHandler } from './infraestructure/events/consumers/process-stage-history.handler';
import { InMemoryProcessStageHistoryRepository } from './infraestructure/persistence/repositories/process-history-stage.repository';

@Module({
  imports: [],
  controllers: [ProcessStageHistoryController, ProcessStageHistoryHandler],
  providers: [
    // Use cases
    CreateProcessStageHistoryUseCase,
    FindAllProcessStageHistoryUseCase,
    // Repositories
    {
      provide: PROCESS_STAGE_HISTORY_REPOSITORY,
      useClass: InMemoryProcessStageHistoryRepository,
    },
  ],
})
export class ProcessStageHistoryModule {}
