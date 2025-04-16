import { Stage } from '../entities/stage.model';

export interface StageRepository {
  findById(id: string): Promise<Stage | undefined>;
  findAll(): Promise<Stage[]>;
}

export const STAGE_REPOSITORY = Symbol('StageRepository');
