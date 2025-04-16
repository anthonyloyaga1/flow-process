import { ModelBase } from '../../../../shared/base-class/model-base';
import { CatalogDetail } from '../../common/models/catalog';
import { Process } from './process';

export class CurReview extends ModelBase {
  id: number;
  processId: number;
  currentStageStartDate: Date;
  curDate: string;
  curNumber: number;
  statusCurId: number;
  zoneCoordinatorIdentifier: string;
  zoneCoordinatorName: string;
  observations?: string;
  createdByName: string;
  createdByInitials: string;

  process: Process;
  statusCur: CatalogDetail;
}
