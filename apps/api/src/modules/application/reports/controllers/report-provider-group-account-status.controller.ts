import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Resource, Scopes } from 'nest-keycloak-connect';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { ReportProviderGroupAccountStatusDomService } from '../../../domain/reports/services/report-provider-group-account-status.dom.service';
import { ReportFilterQuery } from '../dto/report-filters.query.dto';
import { ReportProviderGroupAccountService } from '../services/report-provider-group-acount-reports.service';

@ApiBearerAuth()
@ApiTags('Reports')
@Resource('Reports')
@Controller('reports')
export class ReportProviderGroupAccountStatusController {
  constructor(private readonly reportProviderGroupAccountStatusService: ReportProviderGroupAccountService) {}

  @Get('provider-group-account-status')
  @ApiOperation({ summary: 'Crear reporte de estado de cuenta de proveedores' })
  @SwaggerResponses(ReportProviderGroupAccountStatusDomService)
  @Scopes('report')
  createReportProviderGroupAccountStatusService(@Query() query: ReportFilterQuery) {
    return this.reportProviderGroupAccountStatusService.createReport(query);
  }
}
