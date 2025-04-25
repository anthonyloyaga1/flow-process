import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { Process } from '../../domain/entities/process.model';
import { PROCESS_REPOSITORY, ProcessRepository } from '../../domain/repositories/process.repository';

@Injectable()
export class ProcessFinder {
  constructor(@Inject(PROCESS_REPOSITORY) private readonly processRepository: ProcessRepository) {}

  async findById(id: string): Promise<Process> {
    const process = await this.processRepository.findById(id);
    if (!process) throw new NotFoundException(`Process with ID ${id} not found`);

    return process;
  }

  async findAll(): Promise<Process[]> {
    return this.processRepository.findAll();
  }
}
