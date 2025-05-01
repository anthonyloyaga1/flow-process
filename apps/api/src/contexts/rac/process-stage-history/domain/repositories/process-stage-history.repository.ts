import { ProcessStageHistory } from '../entities/process-stage-history.entity';

export interface ProcessStageHistoryRepository {
  save(processStageHistory: ProcessStageHistory): Promise<void>;
  findAll(): Promise<ProcessStageHistory[]>;
}

export const PROCESS_STAGE_HISTORY_REPOSITORY = Symbol('ProcessStageHistoryRepository');
