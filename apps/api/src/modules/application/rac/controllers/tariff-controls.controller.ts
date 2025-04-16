import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, Resource, Scopes } from 'nest-keycloak-connect';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { TokenInfo } from '../../../../shared/interfaces/token-info.interface';
import { TariffControlBasicDoc, TariffControlDoc } from '../docs/tariff-control.doc';
import { CreateTariffControlDto } from '../dto/create-tariff-control.dto';
import { UpdateTariffControlDto } from '../dto/update-tariff-control.dto';
import { TariffControlsService } from '../services/tariff-controls.service';

@ApiBearerAuth()
@ApiTags('Tariff controls (Control de Tarifas)')
@Controller('tariff-controls')
@Resource('TariffControls')
export class TariffControlsController {
  constructor(private readonly tariffControlsService: TariffControlsService) {}

  @Post()
  @Scopes('create')
  @ApiOperation({ summary: 'Crear control tarifas' })
  @SwaggerResponses(TariffControlBasicDoc)
  create(@Body() body: CreateTariffControlDto, @AuthenticatedUser() user: TokenInfo) {
    return this.tariffControlsService.create(body, {
      user: user || { preferred_username: user?.preferred_username || '1724601234', name: 'admin create' },
    });
  }

  @Get(':id')
  @Scopes('read')
  @ApiOperation({ summary: 'Obtener control tarifas por id' })
  @SwaggerResponses(TariffControlDoc)
  findOneById(@Param('id') id: string) {
    return this.tariffControlsService.findOneById(+id);
  }

  @Get('processId/:processId')
  @Scopes('read')
  @ApiOperation({ summary: 'Obtener control técnico tarifas por Id del trámite' })
  @SwaggerResponses(TariffControlDoc)
  findOneByProcessId(@Param('processId') processId: string) {
    return this.tariffControlsService.findOneByProcessId(+processId);
  }

  @Put(':id')
  @Scopes('update')
  @ApiOperation({ summary: 'Actualizar control tarifas' })
  @SwaggerResponses(TariffControlBasicDoc)
  update(@Param('id') id: string, @Body() body: UpdateTariffControlDto, @AuthenticatedUser() user: TokenInfo) {
    return this.tariffControlsService.update(+id, body, {
      user: user || { preferred_username: user?.preferred_username || '1724601234', name: 'admin update' },
    });
  }
}
