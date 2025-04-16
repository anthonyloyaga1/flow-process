import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { parseToCamelCase } from '../../../../shared/helpers/parse-to-camelcase';
import { ReportProviderAccountStatusView } from '../entities/report-provider-account-status.view';
import { ReportProviderGroupAccountStatusView } from '../entities/report-provider-group-account-status.view';

@Injectable()
export class ReportProviderGroupAccountStatusRepository {
  constructor(
    @InjectRepository(ReportProviderAccountStatusView)
    private readonly reportProviderGroupAccountStatusRepository: Repository<ReportProviderAccountStatusView>,
  ) {}

  async createReport(body: any): Promise<ReportProviderGroupAccountStatusView[]> {
    try {
      const { providerId, provinceCode, zoneCode, startDate, endDate, processStageId } = body;

      const query = this.reportProviderGroupAccountStatusRepository
        .createQueryBuilder('view')
        .select([
          'provider_group_aggregated_id',
          'provider_group_aggregated_name',
          'SUM(total_requested_amount) AS total_requested_amount',
          'SUM(CASE WHEN process_stage_id IN (5, 6, 7, 8) THEN total_objected_value ELSE 0 END) AS total_objected_value',
          'SUM(CASE WHEN process_stage_id IN (6, 7, 8) THEN total_approved_value ELSE 0 END) AS total_approved_value_stage_6_7_8',
          'SUM(CASE WHEN process_stage_id = 7 THEN total_approved_value ELSE 0 END) AS total_approved_value_stage_7',
          'SUM(CASE WHEN process_stage_id IN (1, 2, 3, 4) THEN total_requested_amount ELSE 0 END) AS total_requested_amount_stage_1_2_3_4',
          'SUM(CASE WHEN process_stage_id = 6 THEN total_approved_value ELSE 0 END) AS total_approved_value_stage_6',
          'SUM(CASE WHEN process_stage_id = 5 THEN total_approved_value ELSE 0 END) AS total_approved_value_stage_5',
        ])
        .groupBy('view.providerGroupAggregatedId')
        .addGroupBy('view.providerGroupAggregatedName');

      if (providerId) {
        query.andWhere('view.providerId = :providerId', { providerId });
      }
      if (provinceCode) {
        query.andWhere('view.providerProvinceCode = :provinceCode', { provinceCode });
      }
      if (zoneCode) {
        query.andWhere('view.providerZoneCode = :zoneCode', { zoneCode });
      }
      if (startDate) {
        query.andWhere('view.receptionDate >= :startDate', { startDate });
      }
      if (endDate) {
        query.andWhere('view.receptionDate <= :endDate', { endDate });
      }
      if (processStageId) {
        query.andWhere('view.processStageId = :processStageId', { processStageId });
      }

      const data = await query.getRawMany();
      return parseToCamelCase(data);
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }
}
