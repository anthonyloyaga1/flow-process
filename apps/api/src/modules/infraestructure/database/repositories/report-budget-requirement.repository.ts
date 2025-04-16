import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { ReportBudgetRequirementView } from '../entities/report-budget-requirement.view';

@Injectable()
export class ReportBudgetRequirementRepository {
  constructor(
    @InjectRepository(ReportBudgetRequirementView)
    private readonly reportBudgetRequirementRepository: Repository<ReportBudgetRequirementView>,
  ) {}

  async createReport(body: any): Promise<ReportBudgetRequirementView[]> {
    try {
      const { providerId, provinceCode, zoneCode, startDate, endDate, processStageId } = body;

      const query = this.reportBudgetRequirementRepository.createQueryBuilder('reportBR');

      if (providerId) {
        query.andWhere('reportBR.providerId = :providerId', { providerId });
      }
      if (provinceCode) {
        query.andWhere('reportBR.providerProvinceCode = :provinceCode', { provinceCode });
      }
      if (zoneCode) {
        query.andWhere('reportBR.providerZoneCode = :zoneCode', { zoneCode });
      }
      if (startDate) {
        query.andWhere('reportBR.receptionDate >= :startDate', { startDate });
      }
      if (endDate) {
        query.andWhere('reportBR.receptionDate <= :endDate', { endDate });
      }
      if (processStageId) {
        query.andWhere('reportBR.processStageId = :processStageId', { processStageId });
      }

      const data = await query.getMany();
      return data;
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }
}
