import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Scopes } from 'nest-keycloak-connect';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { OrganizationDoc, OrganizationListMinimalDoc, organizationPaginateDocConfig, OrganizationPagingDoc } from '../docs/organization.doc';
import { OrganizationsService } from '../services/organizations.service';

@ApiBearerAuth()
@ApiTags('Common (recursos comunes)')
@Controller('common/organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('collection')
  @Scopes()
  @ApiOperation({ summary: 'Colección de organizaciones' })
  @ApiPaginationQuery(organizationPaginateDocConfig)
  @SwaggerResponses(OrganizationPagingDoc)
  async getOrganizationCollection(@Paginate() query: PaginateQuery) {
    return this.organizationsService.findCollection(query);
  }

  @Get('unicode/:unicode')
  @Scopes()
  @ApiOperation({ summary: 'Organización por unicódigo' })
  @SwaggerResponses(OrganizationDoc)
  async findOne(@Param('unicode') unicode: string) {
    return this.organizationsService.findOneByUnicodigo(unicode);
  }

  @Get('zones')
  @Scopes()
  @ApiOperation({ summary: 'Provincias de zonas' })
  @SwaggerResponses(OrganizationListMinimalDoc)
  async findListZones() {
    return this.organizationsService.findListZones();
  }
}
