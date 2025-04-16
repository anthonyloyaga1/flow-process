import { ModelBase } from '../../../../shared/base-class/model-base';
import { Process } from './process';

export class DocumentaryReview extends ModelBase {
  id: number;
  processId: number;
  currentStageStartDate: Date;
  reviewDate: string;
  secondReviewDate: string;
  delayReason: string;
  objectedPatientsDetails: string;
  objectedFilesCount: number;
  filesDeliveryDate: string;
  createdByName: string;
  createdByInitials: string;
  process: Process;
}
