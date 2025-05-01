import { Injectable } from '@nestjs/common';

import { ProcessStageHistoryCreateDto } from '../../application/dtos/process-stage-history.dto';
import { ProcessStageHistoryPrimitives } from '../types/process-stage-history.type';
import { ProcessStageHistoryId } from '../value-objects/process-stage-history-id.vo';
import { ProcessStageHistory } from './process-stage-history.entity';

@Injectable()
export class ProcessStageHistoryFactory {
  static create(params: ProcessStageHistoryCreateDto): ProcessStageHistory {
    return new ProcessStageHistory({
      ...params,
      processId: params.id,
      id: ProcessStageHistoryId.generate(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending',
    });
  }

  static fromPrimitives(params: ProcessStageHistoryPrimitives): ProcessStageHistory {
    return new ProcessStageHistory({
      ...params,
      id: ProcessStageHistoryId.from(params.id),
      createdAt: new Date(params.createdAt),
      updatedAt: new Date(params.updatedAt),
    });
  }

  static toPublic(params: ProcessStageHistory) {
    return {
      id: params.id.getValue(),
      processId: params.processId,
      newStageId: params.newStageId,
      previousStageId: params.previousStageId,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    };
  }
}
