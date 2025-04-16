import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ schema: 'public', name: 'report_budget_requirement' })
export class ReportBudgetRequirementView {
  @ViewColumn()
  processesId: number;

  @ViewColumn()
  caseNumber: string;

  @ViewColumn()
  providerProvinceDescription: string;

  @ViewColumn()
  providerRuc: string;

  @ViewColumn()
  providerAttentionLevel: string;

  @ViewColumn()
  providerDenomination: string;

  @ViewColumn()
  providerName: string;

  @ViewColumn()
  serviceMonth: number;

  @ViewColumn()
  serviceYear: number;

  @ViewColumn()
  serviceMonthYear: string;

  @ViewColumn()
  fileCount: number;

  @ViewColumn()
  entryTypeName: string;

  @ViewColumn()
  isCatastrophic: boolean;

  @ViewColumn(    {transformer: {
    to: (value: number) => value,
    from: (value: string) => parseFloat(value),
  }})
  approvedValue: number;

  @ViewColumn()
  providerGroupName: string;

  @ViewColumn()
  providerGroupAggregatedName: string;

  @ViewColumn()
  budgetRequestDate: Date;

  @ViewColumn()
  curNumber: string;

  @ViewColumn()
  curDate: Date;

  @ViewColumn()
  providerId: number;

  @ViewColumn()
  providerProvinceCode: string;

  @ViewColumn()
  processStageId: number;

  @ViewColumn()
  providerZoneCode: string;

  @ViewColumn()
  receptionDate: Date;
}
