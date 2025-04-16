import { Inject, Injectable } from '@nestjs/common';

import { ProcessFactory } from '../../domain/entities/process-factory';
import { PROCESS_REPOSITORY, ProcessRepository } from '../../domain/repositories/process.repository';
import { ProcessReadDto } from '../dtos/process.dto';

@Injectable()
export class FindAllProcess {
  constructor(@Inject(PROCESS_REPOSITORY) private readonly processRepository: ProcessRepository) {}

  async execute(): Promise<ProcessReadDto[]> {
    const processes = await this.processRepository.findAll();
    return processes.map((process) => ProcessFactory.toPublic(process));
  }
}
