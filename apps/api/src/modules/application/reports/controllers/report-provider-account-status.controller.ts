import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Resource, Scopes } from 'nest-keycloak-connect';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { ReportProviderAccountStatusDoc } from '../docs/report-provider-account-status.doc';
import { ReportFilterQuery } from '../dto/report-filters.query.dto';
import { ReportProviderAccountService } from '../services/report-provider-acount-reports.service';

@ApiBearerAuth()
@ApiTags('Reports')
@Resource('Reports')
@Controller('reports')
export class ReportProviderAccountStatusController {
  constructor(private readonly reportProviderAccountStatusService: ReportProviderAccountService) {}

  @Get('provider-account-status')
  @ApiOperation({ summary: 'Crear reporte de estado de cuenta de proveedores' })
  @SwaggerResponses(ReportProviderAccountStatusDoc)
  @Scopes('report')
  createReportProviderAccountStatusService(@Query() query: ReportFilterQuery) {
    return this.reportProviderAccountStatusService.createReport(query);
  }
}
