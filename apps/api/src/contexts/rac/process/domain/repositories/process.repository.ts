import { Process } from '../entities/process.model';

export interface ProcessRepository {
  save(process: Process): Promise<void>;
  findById(id: string): Promise<Process>;
  findAll(): Promise<Process[]>;
  update(id: string, process: Process): Promise<void>;
  delete(id: string): Promise<void>;
}

export const PROCESS_REPOSITORY = Symbol('ProcessRepository');
