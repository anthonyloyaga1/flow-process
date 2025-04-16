import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { catalogDetailPaginateDocConfig, CatalogDetailPagingDoc, CatalogDetailSimpleDoc } from '../docs/catalog-detail.doc';
import { CatalogDetailService } from '../services/catalog-detail.service';
import { Scopes } from 'nest-keycloak-connect';

@ApiBearerAuth()
@ApiTags('Common (recursos comunes)')
@Controller('common/catalog')
export class CatalogoController {
  constructor(private readonly catalogDetailService: CatalogDetailService) {}

  @Get('collection')
  @Scopes()
  @ApiOperation({ summary: 'Colección de catálogos' })
  @ApiPaginationQuery(catalogDetailPaginateDocConfig)
  @SwaggerResponses(CatalogDetailPagingDoc)
  async getOrganizationCollection(@Paginate() query: PaginateQuery) {
    return this.catalogDetailService.findCollection(query);
  }

  @Get('id/:id')
  @Scopes()
  @ApiOperation({ summary: 'Catálogos por id' })
  @SwaggerResponses(CatalogDetailSimpleDoc)
  async findOne(@Param('id') id: string) {
    return this.catalogDetailService.findOneById(+id);
  }
}
