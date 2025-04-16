import { ProcessDocumentReceptionDate } from '../value-objects/process-document-reception-date.to';
import { ProcessEntryNumber } from '../value-objects/process-entry-number.vo';
import { ProcessId } from '../value-objects/process-id.vo';
import { ProcessLatestStageDate } from '../value-objects/process-latest-stage-date.vo';
import { ProcessNumber } from '../value-objects/process-number.vo';
import { ProcessRegistrationDate } from '../value-objects/process-registration-date.vo';
import { ProcessRequestedAmount } from '../value-objects/process-request-amount.vo';

export type ProcessProps = {
  readonly id: ProcessId;
  registrationDate: ProcessRegistrationDate;
  entryNumber: ProcessEntryNumber;
  catastrophic: string;
  fileCount: number;
  serviceMonth: string;
  serviceYear: number;
  excelFile: string;
  serviceType: string;
  boxNumber: number;
  providerId: string;
  currentStageId: string;
  requestedAmount: ProcessRequestedAmount;
  processNumber: ProcessNumber;
  documentReceptionDate: ProcessDocumentReceptionDate;
  latestStageDate: ProcessLatestStageDate;
  processObservations?: string | null;
};

export type ProcessPrimitives = {
  id: string;
  processNumber: string;
  documentReceptionDate: string;
  entryNumber: string;
  requestedAmount: number;
  registrationDate: string;
  latestStageDate: string;
  catastrophic: string;
  fileCount: number;
  serviceMonth: string;
  serviceYear: number;
  excelFile: string;
  serviceType: string;
  boxNumber: number;
  providerId: string;
  currentStageId: string;
  processObservations?: string | null;
};
