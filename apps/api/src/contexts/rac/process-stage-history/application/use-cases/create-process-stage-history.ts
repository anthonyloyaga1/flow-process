import { Inject, Injectable } from '@nestjs/common';

import { ProcessStageHistoryFactory } from '../../domain/entities/process-stage-history.factory';
import { PROCESS_STAGE_HISTORY_REPOSITORY, ProcessStageHistoryRepository } from '../../domain/repositories/process-stage-history.repository';
import { ProcessStageHistoryCreateDto } from '../dtos/process-stage-history.dto';

@Injectable()
export class CreateProcessStageHistoryUseCase {
  constructor(@Inject(PROCESS_STAGE_HISTORY_REPOSITORY) private readonly processStageHistoryRepository: ProcessStageHistoryRepository) {}

  async execute(processStageHistory: ProcessStageHistoryCreateDto): Promise<void> {
    const history = ProcessStageHistoryFactory.create(processStageHistory);
    await this.processStageHistoryRepository.save(history);
  }
}
