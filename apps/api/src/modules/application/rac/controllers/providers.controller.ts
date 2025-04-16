import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, Resource, Scopes } from 'nest-keycloak-connect';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { TokenInfo } from '../../../../shared/interfaces/token-info.interface';
import { ProviderBasicDoc, ProviderDoc, ProviderPagingDoc, providersPaginateDocConfig } from '../docs/provider.doc';
import { CreateProviderDto } from '../dto/create-provider.dto';
import { ProvidersService } from '../services/providers.service';

@ApiBearerAuth()
@ApiTags('Providers (prestadores)')
@Controller('providers')
@Resource('Providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  @Scopes('create')
  @ApiOperation({ summary: 'Crear prestadores' })
  @SwaggerResponses(ProviderBasicDoc)
  create(@Body() body: CreateProviderDto, @AuthenticatedUser() user: TokenInfo) {
    return this.providersService.create(body, {
      user: user || { preferred_username: user?.preferred_username || '1724601234', name: 'admin create' },
    });
  }

  @Get('collection')
  @Scopes()
  @ApiOperation({
    summary: 'Colección de prestadores',
    description: `
    Relaciones: [providerGroup, providerGroup.providerGroupAggregated]`,
  })
  @ApiPaginationQuery(providersPaginateDocConfig)
  @SwaggerResponses(ProviderPagingDoc)
  findCollection(@Paginate() query: PaginateQuery) {
    return this.providersService.findCollection(query);
  }

  @Get('unicode/:unicode')
  @Scopes('read')
  @ApiOperation({ summary: 'Prestadores por unicodigo' })
  @SwaggerResponses(ProviderDoc)
  findOneByUnicode(@Param('unicode') unicode: string) {
    return this.providersService.findOneByUnicodigo(+unicode);
  }

  @Get('id/:id')
  @Scopes('read')
  @ApiOperation({ summary: 'Prestadores por id' })
  @SwaggerResponses(ProviderDoc)
  findOneById(@Param('id') id: string) {
    return this.providersService.findOneById(+id);
  }
}
