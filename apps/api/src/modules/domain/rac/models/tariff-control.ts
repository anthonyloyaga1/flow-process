import { ModelBase } from '../../../../shared/base-class/model-base';
import { Process } from './process';

export class TariffControl extends ModelBase {
  id: number;
  processId: number;
  currentStageStartDate: Date;
  liquidationStartDate: string;
  approvedValue: number;
  objectedValue: number;
  delayReason?: string;
  objectedFilesCount?: number;
  filesDeliveryDate?: string;
  objectedFilesCountACFSS?: number;
  objectedFilesDetails?: string;
  documentManagementSendDate: string;
  reportNumber: string;
  memorandumNumber: string;
  documentManagementResponsibleIdentifier: string;
  documentManagementResponsibleName: string;
  createdByName: string;
  createdByInitials: string;
  process: Process;
}
