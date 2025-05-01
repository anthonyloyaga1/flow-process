import { ProcessStageHistoryId } from '../value-objects/process-stage-history-id.vo';

export class ProcessStageHistory {
  id: ProcessStageHistoryId;
  processId: string;
  newStageId: string;
  previousStageId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id: ProcessStageHistoryId;
    processId: string;
    newStageId: string;
    previousStageId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    Object.assign(this, params);
  }
}
