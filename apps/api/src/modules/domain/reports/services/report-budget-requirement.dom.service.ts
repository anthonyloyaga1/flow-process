import { HttpException, Injectable } from '@nestjs/common';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { ReportBudgetRequirementRepository } from '../../../infraestructure/database/repositories/report-budget-requirement.repository';
import { ReportFilters } from '../../rac/models/report';

@Injectable()
export class ReportBudgetRequirementDomService {
  constructor(private readonly reportBudgetRequirementRepository: ReportBudgetRequirementRepository) {}
  async createReport(body: ReportFilters) {
    const report = await this.reportBudgetRequirementRepository.createReport(body);

    if (!report) {
      throw new HttpException(ErrorMessage.REPORT_MATRIX_RAC_NOT_FOUND.MSG, ErrorMessage.REPORT_MATRIX_RAC_NOT_FOUND.CODE);
    }

    return report;
  }
}
