import { Injectable } from '@nestjs/common';

import { Process } from '../../../domain/entities/process.model';
import { EntryNumberEnum } from '../../../domain/enums/entry-number.enum';
import { ProcessRepository } from '../../../domain/repositories/process.repository';
import { ProcessFactory } from '../../../domain/entities/process-factory';

@Injectable()
export class InMemoryProcessRepository implements ProcessRepository {
  private readonly processes: Map<string, Process> = new Map([
    [
      '1',
      ProcessFactory.fromPrimitives({
        id: '550e8400-e29b-41d4-a716-446655440001',
        providerId: 'provider1',
        catastrophic: 'No',
        fileCount: 10,
        serviceMonth: 'Enero',
        serviceYear: 2023,
        excelFile: 'No',
        requestedAmount: 400.0,
        serviceType: 'Tipo A',
        entryNumber: EntryNumberEnum.JUSTIFICACION,
        boxNumber: 101,
        processObservations: 'Observación 1',
        currentStageId: 'RECEPCION_DOCUMENTAL',
        latestStageDate: '06-04-2025',
        documentReceptionDate: '2025-04-06',
        processNumber: '2025-002',
        registrationDate: '2023-01-01',
      }),
    ],
    [
      '2',
      ProcessFactory.fromPrimitives({
        id: '550e8400-e29b-41d4-a716-446655440002',
        providerId: 'provider2',
        catastrophic: 'Si',
        fileCount: 5,
        serviceMonth: 'Febrero',
        serviceYear: 2022,
        excelFile: 'Si',
        requestedAmount: 2000.0,
        serviceType: 'Tipo B',
        entryNumber: EntryNumberEnum.JUSTIFICACION,
        boxNumber: 102,
        currentStageId: 'RECEPCION_DOCUMENTAL',
        latestStageDate: '2023-01-01',
        processObservations: 'Observación 2',
        documentReceptionDate: '2025-04-06',
        processNumber: '2025-002',
        registrationDate: '2023-01-02',
      }),
    ],
  ]);

  save(process: Process): Promise<void> {
    this.processes.set(process.id.getValue(), process);
    return Promise.resolve();
  }

  findById(id: string): Promise<Process | undefined> {
    return Promise.resolve(this.processes.get(id));
  }

  findAll(): Promise<Process[]> {
    return Promise.resolve(Array.from(this.processes.values()));
  }

  update(id: string, updatedProcess: Partial<Process>): Promise<void> {
    const existingProcess = this.processes.get(id);
    if (!existingProcess) {
      return Promise.reject(new Error('Process not found'));
    }

    // Crear una nueva instancia de Process con las propiedades combinadas
    const mergedProcess = new Process({
      ...existingProcess,
      ...updatedProcess,
    });

    this.processes.set(id, mergedProcess);
    return Promise.resolve();
  }

  delete(id: string): Promise<void> {
    const deleted = this.processes.delete(id);
    if (!deleted) {
      return Promise.reject(new Error('Process not found'));
    }
    return Promise.resolve();
  }
}
