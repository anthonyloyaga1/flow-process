import { ModelBase } from '../../../../shared/base-class/model-base';
import { Process } from './process';

export class PaymentShipment extends ModelBase {
  id: number;
  processId: number;
  currentStageStartDate: Date;
  paymentShipmentDate: string;
  fileResponsibleIdentifier: string;
  fileResponsibleName: string;
  fileShipmentDate: string;
  observations?: string;
  createdByName: string;
  createdByInitials: string;

  process: Process;
}
