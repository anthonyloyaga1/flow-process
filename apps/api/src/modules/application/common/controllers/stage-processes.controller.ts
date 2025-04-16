import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Scopes } from 'nest-keycloak-connect';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { StageProcessDoc, StageProcessListDoc } from '../docs/stage-processes.doc';
import { StageProcessesService } from '../services/stage-processes.service';

@ApiBearerAuth()
@ApiTags('Common (recursos comunes)')
@Controller('common/stage-processes')
export class StageProcessesController {
  constructor(private readonly stageProcessesService: StageProcessesService) {}

  @Get('id/:id')
  @Scopes()
  @ApiOperation({ summary: 'Estado del trámite por id' })
  @SwaggerResponses(StageProcessDoc)
  findOneById(@Param('id') id: string) {
    return this.stageProcessesService.findOneById(+id);
  }

  @Get('list')
  @Scopes()
  @ApiOperation({ summary: 'Lista de estados del trámite' })
  @SwaggerResponses(StageProcessListDoc)
  findList() {
    return this.stageProcessesService.findList();
  }
}
