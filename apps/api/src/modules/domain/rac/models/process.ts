import { Type } from 'class-transformer';

import { ModelBase } from '../../../../shared/base-class/model-base';
import { CatalogDetail } from '../../common/models/catalog';
import { StageProcess } from '../../common/models/stage-process';
import { BudgetShipment } from './budget-shipment';
import { CurReview } from './cur-review';
import { DocumentaryReview } from './documentary-review';
import { MedicalControl } from './medical-control';
import { PaymentShipment } from './payment-shipment';
import { Provider } from './provider';
import { TariffControl } from './tariff-control';

export class Process extends ModelBase {
  id: number;
  providerId: number;
  caseNumber: string;
  isCatastrophic: boolean;
  fileCount: number;
  serviceMonth: number;
  serviceYear: number;
  hasFile: boolean;
  requestedAmount: number;
  entryTypeId: number;
  entryNumberId: number;
  boxNumber: number;
  observations: string;
  createdByUserInitials: string;
  createdByName: string;
  receptionDate: string;
  secondReceptionDate: string;
  currentStageId: number;
  currentStageDate: Date;
  returnStageId: number;
  returnStageDate: Date;
  returnStageReason: string;
  returnApproved: boolean;
  statusId: number;
  rejected: boolean;
  returnStageBy: string;
  returnStageByName: string;
  returnApprovalRejectionReason: string;

  @Type(() => Provider)
  provider: Provider;

  @Type(() => CatalogDetail)
  entryType: CatalogDetail;

  @Type(() => CatalogDetail)
  entryNumber: CatalogDetail;

  @Type(() => StageProcess)
  currentStage: StageProcess;

  @Type(() => StageProcess)
  returnStage: StageProcess;

  @Type(() => CatalogDetail)
  status: CatalogDetail;

  @Type(() => DocumentaryReview)
  documentaryReview: DocumentaryReview;

  @Type(() => MedicalControl)
  medicalControl: MedicalControl;

  @Type(() => TariffControl)
  tariffControl: TariffControl;

  @Type(() => BudgetShipment)
  budgetShipment: BudgetShipment;

  @Type(() => PaymentShipment)
  paymentShipment: PaymentShipment;

  @Type(() => CurReview)
  curReview: CurReview;
}
