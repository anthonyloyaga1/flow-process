import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'report_provider_account_status' })
export class ReportProviderAccountStatusView {
  @ViewColumn()
  processId: number;

  @ViewColumn()
  receptionDate: Date;

  @ViewColumn()
  providerZoneCode: string;

  @ViewColumn()
  providerProvinceDescription: string;

  @ViewColumn()
  providerZoneDescription: string;

  @ViewColumn()
  providerRuc: string;

  @ViewColumn()
  providerAttentionLevel: string;

  @ViewColumn()
  providerDenomination: string;

  @ViewColumn()
  providerName: string;

  @ViewColumn()
  totalRequestedAmount: number;

  @ViewColumn()
  totalObjectedValue: number;

  @ViewColumn()
  totalApprovedValue: number;

  @ViewColumn()
  providerGroupId: number;

  @ViewColumn()
  providerGroupName: string;

  @ViewColumn()
  providerGroupAggregatedId: number;

  @ViewColumn()
  providerGroupAggregatedName: string;

  @ViewColumn()
  providerId: number;

  @ViewColumn()
  providerProvinceCode: string;

  @ViewColumn()
  processStageId: number;
}
