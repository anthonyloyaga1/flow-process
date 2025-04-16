import { HttpException, Injectable } from '@nestjs/common';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { ReportProviderGroupAccountStatusRepository } from '../../../infraestructure/database/repositories/report-provider-account-group-status-repository';
import { ReportFilters } from '../../rac/models/report';

@Injectable()
export class ReportProviderGroupAccountStatusDomService {
  constructor(private readonly reportProviderGroupAccountStatusRepository: ReportProviderGroupAccountStatusRepository) {}
  async createReport(body: ReportFilters) {
    const report = await this.reportProviderGroupAccountStatusRepository.createReport(body);

    if (!report) {
      throw new HttpException(ErrorMessage.REPORT_MATRIX_RAC_NOT_FOUND.MSG, ErrorMessage.REPORT_MATRIX_RAC_NOT_FOUND.CODE);
    }

    return report;
  }
}
