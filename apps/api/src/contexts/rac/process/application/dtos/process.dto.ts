export class ProcessCreateDto {
  providerId: string;
  catastrophic: string;
  fileCount: number;
  serviceMonth: string;
  serviceYear: number;
  serviceYear2: number;
  excelFile: string;
  requestedAmount: number;
  serviceType: string;
  entryNumber: string;
  boxNumber: number;
  documentReceptionDate: string;
  processObservations: string;
}

export class ProcessReadDto {
  id: string;
  processNumber: string;
  providerId: string;
  catastrophic: string;
  fileCount: number;
  serviceMonth: string;
  currentStageId: string;
}
