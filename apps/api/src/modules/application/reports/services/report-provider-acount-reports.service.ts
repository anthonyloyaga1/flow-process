import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ReportProviderAccountStatusDomService } from 'src/modules/domain/reports/services/report-provider-account-status.dom.service';

import { ReportFilters } from '../../../domain/rac/models/report';
import { ReportFilterQuery } from '../dto/report-filters.query.dto';
import { ReportProviderAccountStatusDto } from '../dto/report-provider-account-status.dto';

@Injectable()
export class ReportProviderAccountService {
  constructor(private readonly reportProviderAccountDomService: ReportProviderAccountStatusDomService) {}

  async createReport(body: ReportFilterQuery) {
    const reportFilters = plainToInstance(ReportFilters, body);
    const report = await this.reportProviderAccountDomService.createReport(reportFilters);
    return plainToInstance(ReportProviderAccountStatusDto, report);
  }
}
