import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ReportProviderGroupAccountStatusDomService } from 'src/modules/domain/reports/services/report-provider-group-account-status.dom.service';

import { ReportFilters } from '../../../domain/rac/models/report';
import { ReportFilterQuery } from '../dto/report-filters.query.dto';
import { ReportProviderGroupAccountStatusDto } from '../dto/report-provider-group-account-status.dto';

@Injectable()
export class ReportProviderGroupAccountService {
  constructor(private readonly reportProviderGroupAccountDomService: ReportProviderGroupAccountStatusDomService) {}

  async createReport(body: ReportFilterQuery) {
    const reportFilters = plainToInstance(ReportFilters, body);
    const report = await this.reportProviderGroupAccountDomService.createReport(reportFilters);
    return plainToInstance(ReportProviderGroupAccountStatusDto, report);
  }
}
