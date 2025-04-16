import { Injectable } from '@nestjs/common';

import { Stage } from '../../../domain/entities/stage.model';
import { StageRepository } from '../../../domain/repositories/stage.repository';

@Injectable()
export class InMemoryStageRepository implements StageRepository {
  private readonly stages: Map<string, Stage> = new Map([
    [
      'RECEPCION_DOCUMENTAL',
      new Stage({
        id: 'RECEPCION_DOCUMENTAL',
        name: 'Recepción Documental',
        nextStageId: 'REVISION_DOCUMENTAL',
        returnStages: [],
      }),
    ],
    [
      'REVISION_DOCUMENTAL',
      new Stage({
        id: 'REVISION_DOCUMENTAL',
        name: 'Revisión Documental',
        nextStageId: 'REVISION_FISICA',
        returnStages: ['RECEPCION_DOCUMENTAL'],
      }),
    ],
    [
      'REVISION_FISICA',
      new Stage({
        id: 'REVISION_FISICA',
        name: 'Revisión Física',
        nextStageId: 'FINALIZADO',
        returnStages: ['REVISION_DOCUMENTAL'],
      }),
    ],
    [
      'FINALIZADO',
      new Stage({
        id: 'FINALIZADO',
        name: 'Finalizado',
        nextStageId: null,
        returnStages: ['REVISION_FISICA', 'REVISION_DOCUMENTAL'],
      }),
    ],
  ]);

  async findById(stageId: string): Promise<Stage | undefined> {
    return this.stages.get(stageId);
  }

  async findAll(): Promise<Stage[]> {
    return Array.from(this.stages.values());
  }
}
