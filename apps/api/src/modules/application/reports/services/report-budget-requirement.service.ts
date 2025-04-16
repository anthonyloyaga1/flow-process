import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ReportFilters } from '../../../domain/rac/models/report';
import { ReportBudgetRequirementDomService } from '../../../domain/reports/services/report-budget-requirement.dom.service';
import { ReportBudgetRequirementDto } from '../dto/report-budget-requirement.dto';
import { ReportFilterQuery } from '../dto/report-filters.query.dto';

@Injectable()
export class ReportBudgetRequirementService {
  constructor(private readonly reportBudgetRequirementDomService: ReportBudgetRequirementDomService) {}

  async createReport(body: ReportFilterQuery) {
    const reportFilters = plainToInstance(ReportFilters, body);
    const report = await this.reportBudgetRequirementDomService.createReport(reportFilters);
    return plainToInstance(ReportBudgetRequirementDto, report);
  }
}
