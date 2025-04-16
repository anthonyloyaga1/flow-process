import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Resource, Scopes } from 'nest-keycloak-connect';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { ReportMatrixRacListDoc } from '../docs/report-matrix-rac.doc';
import { ReportFilterQuery } from '../dto/report-filters.query.dto';
import { ReportMatrixRacService } from '../services/report-matrix-rac.service';

@ApiBearerAuth()
@ApiTags('Reports')
@Resource('Reports')
@Controller('reports')
export class ReportMatrixRacController {
  constructor(private readonly reportMatrizRacService: ReportMatrixRacService) {}

  @Get('matrix-rac')
  @ApiOperation({ summary: 'Crear reporte de Matriz RAC' })
  @SwaggerResponses(ReportMatrixRacListDoc)
  @Scopes('report')
  createReport(@Query() query: ReportFilterQuery) {
    return this.reportMatrizRacService.createReport(query);
  }
}
