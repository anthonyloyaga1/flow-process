import { Injectable } from '@nestjs/common';

import { ProcessStageHistory } from '../../../domain/entities/process-stage-history.entity';
import { ProcessStageHistoryFactory } from '../../../domain/entities/process-stage-history.factory';
import { ProcessStageHistoryRepository } from '../../../domain/repositories/process-stage-history.repository';

@Injectable()
export class InMemoryProcessStageHistoryRepository implements ProcessStageHistoryRepository {
  private readonly processStageHistories: Map<string, ProcessStageHistory> = new Map([
    [
      '1',
      ProcessStageHistoryFactory.fromPrimitives({
        id: '550e8400-e29b-41d4-a716-446655440001',
        processId: '550e8400-e29b-41d4-a716-446655440001',
        newStageId: 'RECEPCION_DOCUMENTAL',
        previousStageId: 'INICIO',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending',
      }),
    ],
    [
      '2',
      ProcessStageHistoryFactory.fromPrimitives({
        id: '550e8400-e29b-41d4-a716-446655440002',
        processId: '550e8400-e29b-41d4-a716-446655440002',
        newStageId: 'INICIO',
        previousStageId: 'RECEPCION_DOCUMENTAL',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending',
      }),
    ],
  ]);

  async save(processStageHistory: ProcessStageHistory): Promise<void> {
    this.processStageHistories.set(processStageHistory.id.getValue(), processStageHistory);
  }

  async findAll(): Promise<ProcessStageHistory[]> {
    return Promise.resolve(Array.from(this.processStageHistories.values()));
  }
}
