import { HttpException, Injectable } from '@nestjs/common';
import { ErrorMessage } from 'src/shared/constants/error-messages';

import { ReportProviderAccountStatusRepository } from '../../../infraestructure/database/repositories/report-provider-account-status-repository';
import { ReportFilters } from '../../rac/models/report';

@Injectable()
export class ReportProviderAccountStatusDomService {
  constructor(private readonly reportProviderAccountStatusRepository: ReportProviderAccountStatusRepository) {}
  async createReport(body: ReportFilters) {
    const report = await this.reportProviderAccountStatusRepository.createReport(body);

    if (!report) {
      throw new HttpException(ErrorMessage.REPORT_MATRIX_RAC_NOT_FOUND.MSG, ErrorMessage.REPORT_MATRIX_RAC_NOT_FOUND.CODE);
    }

    return report;
  }
}
