import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ReportMatrixRacDomService } from 'src/modules/domain/reports/services/report-matrix-rac.dom.service';

import { ReportFilters } from '../../../domain/rac/models/report';
import { ReportFilterQuery } from '../dto/report-filters.query.dto';
import { ReportMatrixRacDto } from '../dto/report-matrix-rac.dto';

@Injectable()
export class ReportMatrixRacService {
  constructor(private readonly reportMatrixRacDomService: ReportMatrixRacDomService) {}

  async createReport(body: ReportFilterQuery) {
    const reportFilters = plainToInstance(ReportFilters, body);
    const report = await this.reportMatrixRacDomService.createReport(reportFilters);
    return plainToInstance(ReportMatrixRacDto, report);
  }
}
