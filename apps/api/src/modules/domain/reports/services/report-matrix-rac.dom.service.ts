import { HttpException, Injectable } from '@nestjs/common';
import { ErrorMessage } from 'src/shared/constants/error-messages';

import { ReportMatrixRacRepository } from '../../../infraestructure/database/repositories/report-matrix-rac.repository';
import { ReportFilters } from '../../rac/models/report';

@Injectable()
export class ReportMatrixRacDomService {
  constructor(private readonly reportMatrixRacRepository: ReportMatrixRacRepository) {}
  async createReport(body: ReportFilters) {
    const report = await this.reportMatrixRacRepository.createReport(body);

    if (!report) {
      throw new HttpException(ErrorMessage.REPORT_MATRIX_RAC_NOT_FOUND.MSG, ErrorMessage.REPORT_MATRIX_RAC_NOT_FOUND.CODE);
    }

    return report;
  }
}
