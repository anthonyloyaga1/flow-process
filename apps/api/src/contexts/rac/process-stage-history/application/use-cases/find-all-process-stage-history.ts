import { Inject, Injectable } from '@nestjs/common';

import { ProcessStageHistoryFactory } from '../../domain/entities/process-stage-history.factory';
import { PROCESS_STAGE_HISTORY_REPOSITORY, ProcessStageHistoryRepository } from '../../domain/repositories/process-stage-history.repository';

@Injectable()
export class FindAllProcessStageHistoryUseCase {
  constructor(@Inject(PROCESS_STAGE_HISTORY_REPOSITORY) private readonly processStageHistoryRepository: ProcessStageHistoryRepository) {}

  async execute() {
    const histories = await this.processStageHistoryRepository.findAll();
    return histories.map((history) => ProcessStageHistoryFactory.toPublic(history));
  }
}
