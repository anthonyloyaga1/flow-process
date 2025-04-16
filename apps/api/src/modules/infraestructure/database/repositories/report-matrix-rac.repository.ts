import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { ReportMatrixRacView } from '../entities/report-matrix.view';

@Injectable()
export class ReportMatrixRacRepository {
  constructor(
    @InjectRepository(ReportMatrixRacView)
    private readonly reportMatrixRacRepository: Repository<ReportMatrixRacView>,
  ) {}

  async createReport(body: any): Promise<ReportMatrixRacView[]> {
    try {
      const { providerId, provinceCode, zoneCode, startDate, endDate, processStageId } = body;

      const query = this.reportMatrixRacRepository.createQueryBuilder('reportMatrixViewRac');

      if (providerId) {
        query.andWhere('reportMatrixViewRac.providerId = :providerId', { providerId });
      }
      if (provinceCode) {
        query.andWhere('reportMatrixViewRac.providerProvinceCode = :provinceCode', { provinceCode });
      }
      if (zoneCode) {
        query.andWhere('reportMatrixViewRac.providerZoneCode = :zoneCode', { zoneCode });
      }
      if (startDate) {
        query.andWhere('reportMatrixViewRac.receptionDate >= :startDate', { startDate });
      }
      if (endDate) {
        query.andWhere('reportMatrixViewRac.receptionDate <= :endDate', { endDate });
      }
      if (processStageId) {
        query.andWhere('reportMatrixViewRac.processStageId = :processStageId', { processStageId });
      }

      const data = await query.getMany();
      return data;
    } catch (error) {
      throw new HttpException(ErrorMessage.DATABASE_ERROR.MSG, ErrorMessage.DATABASE_ERROR.CODE, { cause: error });
    }
  }
}
