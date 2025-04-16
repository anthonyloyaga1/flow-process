import { ModelBase } from '../../../../shared/base-class/model-base';
import { Process } from './process';

export class BudgetShipment extends ModelBase {
  id: number;
  processId: number;
  currentStageStartDate: Date;
  budgetRequestDate: string;
  observations?: string;
  invoiceRequestDate: string;
  invoiceDeliveryDate: string;
  invoiceNumber: string;
  createdByName: string;
  createdByInitials: string;

  process: Process;
}
