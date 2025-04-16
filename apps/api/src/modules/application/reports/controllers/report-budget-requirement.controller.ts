import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Resource, Scopes } from 'nest-keycloak-connect';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { ReportBudgetRequirementListDoc } from '../docs/report-budget-requirement.doc';
import { ReportFilterQuery } from '../dto/report-filters.query.dto';
import { ReportBudgetRequirementService } from '../services/report-budget-requirement.service';

@ApiBearerAuth()
@ApiTags('Reports')
@Resource('Reports')
@Controller('reports')
export class ReportBudgetRequirementController {
  constructor(private readonly reportMatrizRacService: ReportBudgetRequirementService) {}

  @Get('requirement-budget')
  @ApiOperation({ summary: 'Crear reporte de requerimiento de presupuesto' })
  @SwaggerResponses(ReportBudgetRequirementListDoc)
  @Scopes('report')
  createReport(@Query() query: ReportFilterQuery) {
    return this.reportMatrizRacService.createReport(query);
  }
}
