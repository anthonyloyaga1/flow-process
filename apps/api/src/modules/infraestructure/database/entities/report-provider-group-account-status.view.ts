import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'report_provider_group_account_status' })
export class ReportProviderGroupAccountStatusView {
  @ViewColumn()
  providerId: number;

  @ViewColumn()
  providerName: string;

  @ViewColumn()
  providerGroupName: string;

  @ViewColumn()
  requestedAmount: number;

  @ViewColumn()
  objectedValue: number;

  @ViewColumn()
  approvedValue: number;

  @ViewColumn()
  providerProvinceCode: string;

  @ViewColumn()
  providerZoneCode: string;

  @ViewColumn()
  receptionDate: Date;

  @ViewColumn()
  processStageId: number;
}
