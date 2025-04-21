import { ProcessCreateDto, ProcessReadDto } from '../../application/dtos/process.dto';
import { DomainConstants } from '../constants/domain-constants';
import { ProcessCreatedEvent } from '../events/process-created.event';
import { ProcessPrimitives } from '../types/process.type';
import { ProcessDocumentReceptionDate } from '../value-objects/process-document-reception-date.to';
import { ProcessEntryNumber } from '../value-objects/process-entry-number.vo';
import { ProcessId } from '../value-objects/process-id.vo';
import { ProcessLatestStageDate } from '../value-objects/process-latest-stage-date.vo';
import { ProcessNumber } from '../value-objects/process-number.vo';
import { ProcessRegistrationDate } from '../value-objects/process-registration-date.vo';
import { ProcessRequestedAmount } from '../value-objects/process-request-amount.vo';
import { Process } from './process.model';

export class ProcessFactory {
  static create(params: ProcessCreateDto): Process {
    const processCreated = new Process({
      ...params,
      id: ProcessId.generate(),
      processNumber: ProcessNumber.create(params.serviceYear, params.boxNumber),
      documentReceptionDate: ProcessDocumentReceptionDate.create(params.documentReceptionDate),
      entryNumber: ProcessEntryNumber.create(params.entryNumber),
      requestedAmount: ProcessRequestedAmount.create(params.requestedAmount),
      //Default values
      currentStageId: DomainConstants.FIRST_STAGE_ID,
      registrationDate: ProcessRegistrationDate.now(),
      latestStageDate: ProcessLatestStageDate.now(),
    });

    processCreated.apply(
      new ProcessCreatedEvent({
        id: processCreated.id.getValue(),
        providerId: processCreated.providerId,
        catastrophic: processCreated.catastrophic,
        fileCount: processCreated.fileCount,
        serviceMonth: processCreated.serviceMonth,
      }),
    );
    return processCreated;
  }

  static fromPrimitives(props: ProcessPrimitives): Process {
    return new Process({
      ...props,
      id: ProcessId.from(props.id),
      registrationDate: ProcessRegistrationDate.from(props.registrationDate),
      processNumber: ProcessNumber.from(props.processNumber),
      documentReceptionDate: ProcessDocumentReceptionDate.from(props.documentReceptionDate),
      entryNumber: ProcessEntryNumber.from(props.entryNumber),
      requestedAmount: ProcessRequestedAmount.from(props.requestedAmount),
      latestStageDate: ProcessLatestStageDate.from(props.latestStageDate),
    });
  }

  static toPublic(process: Process): ProcessReadDto {
    return {
      id: process.id.getValue(),
      processNumber: process.processNumber.getValue(),
      providerId: process.providerId,
      catastrophic: process.catastrophic,
      fileCount: process.fileCount,
      serviceMonth: process.serviceMonth,
      currentStageId: process.currentStageId,
    };
  }

  static toPrimitives(process: Partial<Process>): ProcessPrimitives {
    return {
      id: process.id.getValue(),
      registrationDate: process.registrationDate.getValue(),
      entryNumber: process.entryNumber.getValue(),
      catastrophic: process.catastrophic,
      fileCount: process.fileCount,
      serviceMonth: process.serviceMonth,
      serviceYear: process.serviceYear,
      excelFile: process.excelFile,
      serviceType: process.serviceType,
      boxNumber: process.boxNumber,
      providerId: process.providerId,
      currentStageId: process.currentStageId,
      requestedAmount: process.requestedAmount.getValue(),
      processNumber: process.processNumber.getValue(),
      documentReceptionDate: process.documentReceptionDate.getValue(),
      latestStageDate: process.latestStageDate.getValue(),
    };
  }
}
