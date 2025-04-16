import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { ProviderGroupListDoc } from '../docs/provider-group.doc';
import { ProviderGroupsService } from '../services/provider-groups.service';
import { Scopes } from 'nest-keycloak-connect';

@ApiBearerAuth()
@ApiTags('Common (recursos comunes)')
@Controller('common/provider-groups')
export class ProviderGroupsController {
  constructor(private readonly grupoPrestadoresService: ProviderGroupsService) {}

  @Get('list')
  @Scopes()
  @ApiOperation({ summary: 'Lista de grupos de prestadores' })
  @SwaggerResponses(ProviderGroupListDoc)
  findList() {
    return this.grupoPrestadoresService.findList();
  }
}
