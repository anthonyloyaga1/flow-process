import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Scopes } from 'nest-keycloak-connect';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { ReportTypeDoc, ReportTypeListDoc } from '../docs/report-type.doc';
import { ReportsService } from '../services/reports.service';

@ApiBearerAuth()
@ApiTags('Common (recursos comunes)')
@Controller('common/report-types')
export class ReportTypesController {
  constructor(private readonly reportTypesService: ReportsService) {}

  @Get('id/:id')
  @Scopes()
  @ApiOperation({ summary: 'Tipos de reportes por id' })
  @SwaggerResponses(ReportTypeDoc)
  findOneById(@Param('id') id: string) {
    return this.reportTypesService.findOneById(+id);
  }

  @Get('list')
  @Scopes()
  @ApiOperation({ summary: 'Lista de tipos de reportes' })
  @SwaggerResponses(ReportTypeListDoc)
  findList() {
    return this.reportTypesService.findList();
  }
}
