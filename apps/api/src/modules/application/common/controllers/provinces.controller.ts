import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Scopes } from 'nest-keycloak-connect';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { ProvinceDoc, provincePaginateDocConfig, ProvincePagingDoc } from '../docs/province.doc';
import { ProvinciaService } from '../services/provinces.service';

@ApiBearerAuth()
@ApiTags('Common (recursos comunes)')
@Controller('common/province')
export class ProvincesController {
  constructor(private readonly provinceService: ProvinciaService) {}

  @Get('collection')
  @Scopes()
  @ApiOperation({ summary: 'Colección de provincias' })
  @ApiPaginationQuery(provincePaginateDocConfig)
  @SwaggerResponses(ProvincePagingDoc)
  findCollection(@Paginate() query: PaginateQuery) {
    return this.provinceService.findCollection(query);
  }

  @Get('code/:code')
  @Scopes()
  @ApiOperation({ summary: 'Provincia por código' })
  @SwaggerResponses(ProvinceDoc)
  findOneByCode(@Param('code') code: string) {
    return this.provinceService.findOneByCode(code);
  }
}
