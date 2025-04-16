import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'report_matrix_rac' })
export class ReportMatrixRacView {
  @ViewColumn()
  processesId: number;

  @ViewColumn()
  providerZoneCode: string;

  @ViewColumn()
  providerProvinceDescription: string;

  @ViewColumn()
  createdByInitials: string;

  @ViewColumn()
  currentStageStatus: string;

  @ViewColumn()
  receptionDate: string;

  @ViewColumn()
  createdByName: string;

  @ViewColumn()
  caseNumber: string;

  @ViewColumn()
  hasFile: boolean;

  @ViewColumn()
  providerRuc: string;

  @ViewColumn()
  providerName: string;

  @ViewColumn()
  isCatastrophic: boolean;

  @ViewColumn()
  fileCount: number;

  @ViewColumn()
  serviceMonthYear: string;

  @ViewColumn()
  serviceYear: number;

  @ViewColumn()
  requestedAmount: number;

  @ViewColumn()
  entryTypeName: number;

  @ViewColumn()
  entryNumberName: string;

  @ViewColumn()
  boxNumber: string;

  @ViewColumn()
  documentaryReviewDate: string;

  @ViewColumn()
  documentaryReviewCreatedByInitials: string;

  @ViewColumn()
  medicalControlStartDate: string;

  @ViewColumn()
  medicalControlCreatedByName: string;

  @ViewColumn()
  tariffControlCurrentStageStartDate: string;

  @ViewColumn()
  tariffControlCreatedByName: string;

  @ViewColumn()
  tariffControlApprovedValue: number;

  @ViewColumn()
  tariffControlObjectedValue: number;

  @ViewColumn()
  documentaryReviewCurrentStageStartDate: Date;

  @ViewColumn()
  documentaryReviewCreatedByName: string;

  @ViewColumn()
  tariffControlReportNumber: string;

  @ViewColumn()
  tariffControlMemorandumNumber: string;

  @ViewColumn()
  budgetShipmentBudgetRequestDate: string;

  @ViewColumn()
  budgetShipmentInvoiceRequestDate: string;

  @ViewColumn()
  budgetShipmentInvoiceDeliveryDate: string;

  @ViewColumn()
  invoiceNumber: string;

  @ViewColumn()
  paymentShipmentCurrentStageStartDate: Date;

  @ViewColumn()
  paymentShipmentFileShipmentDate: string;

  @ViewColumn()
  fileResponsibleName: string;

  @ViewColumn()
  totalObjectedFilesCount: number;

  @ViewColumn()
  totalObjectedPatientsDetails: string;

  @ViewColumn()
  documentaryReviewObjectedFilesCount: number;

  @ViewColumn()
  medicalControlObjectedFilesCount: number;

  @ViewColumn()
  tariffControlObjectedFilesCount: number;

  @ViewColumn()
  totalFilesDeliveryDate: string;

  @ViewColumn()
  curReviewZoneCoordinatorName: string;

  @ViewColumn()
  observations: string;

  @ViewColumn()
  curReviewCurNumber: string;

  @ViewColumn()
  curReviewCurDate: string;

  @ViewColumn()
  providerGroupName: string;

  @ViewColumn()
  providerAttentionLevel: string;

  @ViewColumn()
  providerDenomination: string;

  @ViewColumn()
  providerGroupAggregatedName: string;

  @ViewColumn()
  providerProvinceCode: string;

  @ViewColumn()
  providerId: number;

  @ViewColumn()
  processStageId: number;
}
