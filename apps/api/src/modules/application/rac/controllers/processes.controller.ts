import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, Resource, Scopes } from 'nest-keycloak-connect';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';

import { DeletedSuccessDoc } from '../../../../shared/base-class/doc-base';
import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { TokenInfo } from '../../../../shared/interfaces/token-info.interface';
import { ProcessBasicDoc, ProcessDoc, processesPaginateDocConfig, ProcessPagingDoc } from '../docs/process.doc';
import { CreateProcessDto } from '../dto/create-process.dto';
import { UpdateProcessDto, UpdateRestoreStageProcessDto } from '../dto/update-process.dto';
import { ProcessesService } from '../services/processes.service';

@ApiBearerAuth()
@ApiTags('Processes (trámites)')
@Controller('processes')
@Resource('Processes')
export class ProcessesController {
  constructor(private readonly processesService: ProcessesService) {}

  @Post()
  @Scopes('create')
  @ApiOperation({ summary: 'Crear trámites' })
  @SwaggerResponses(ProcessBasicDoc)
  create(@Body() body: CreateProcessDto, @AuthenticatedUser() user: TokenInfo) {
    return this.processesService.create(body, { user: user || { preferred_username: user?.preferred_username || '1724601234', name: 'admin' } });
  }

  @Get('collection')
  @Scopes()
  @ApiOperation({
    summary: 'Colección de trámites',
    description: `
    Relaciones: [entryType, entryNumber, currentStage, returnStage, status, documentaryReview, medicalControl, tariffControl, budgetShipment, paymentShipment, provider, provider.providerGroup, provider.providerGroup.providerGroupAggregated]`,
  })
  @ApiPaginationQuery(processesPaginateDocConfig)
  @SwaggerResponses(ProcessPagingDoc)
  findCollection(@Paginate() query: PaginateQuery) {
    return this.processesService.findCollection(query);
  }

  @Get(':id')
  @Scopes()
  @ApiOperation({ summary: 'Trámites por id' })
  @SwaggerResponses(ProcessDoc)
  findOneById(@Param('id') id: string) {
    return this.processesService.findOneById(+id);
  }

  @Get(':id/show')
  @Scopes()
  @ApiOperation({ summary: 'Trámites por id' })
  @SwaggerResponses(ProcessDoc)
  @ApiQuery({
    name: 'select',
    required: false,
    description: `
    Campos seleccionables (Ejemplo) id,providerId,caseNumber,currentStageId,returnStageId,statusId,entryType.id,entryType.name,provider.id,provider.name
    Relaciones: [entryType, entryNumber, provider, currentStage, returnStage, status, documentaryReview, medicalControl, tariffControl, budgetShipment, paymentShipment, provider, provider.providerGroup, provider.providerGroup.providerGroupAggregated]`,
  })
  findOneByIdSelectable(@Param('id') id: string, @Query('select') select?: string) {
    return this.processesService.findOneByIdSelectable(+id, select);
  }

  @Put(':id')
  @Scopes('update')
  @ApiOperation({ summary: 'Actualizar trámites' })
  @SwaggerResponses(ProcessBasicDoc)
  update(@Param('id') id: string, @Body() body: UpdateProcessDto, @AuthenticatedUser() user: TokenInfo) {
    return this.processesService.update(+id, body, {
      user: user || { preferred_username: user?.preferred_username || 'admin_modi', name: 'admin update' },
    });
  }

  @Delete(':id')
  @Scopes('delete')
  @ApiOperation({ summary: 'Eliminar trámites' })
  @SwaggerResponses(DeletedSuccessDoc)
  remove(@Param('id') id: string, @AuthenticatedUser() user: TokenInfo) {
    return this.processesService.remove(+id, {
      user: user || { preferred_username: user?.preferred_username || 'admin_dele', name: 'admin delete' },
    });
  }

  @Patch('send-next-stage/:id')
  @Scopes()
  @ApiOperation({ summary: 'Enviar el trámite a la siguiente etapa' })
  @SwaggerResponses(ProcessBasicDoc)
  sendNextStage(@Param('id') id: string, @AuthenticatedUser() user: TokenInfo) {
    return this.processesService.sendNextStage(+id, {
      user: user || { preferred_username: user?.preferred_username || '1724601234', name: 'admin next' },
    });
  }

  @Patch('send-previous-stage/:id')
  @Scopes()
  @ApiOperation({ summary: 'Enviar el trámite a la etapa anterior' })
  @SwaggerResponses(ProcessBasicDoc)
  sendToPreviousStage(@Param('id') id: string, @Body() body: UpdateRestoreStageProcessDto, @AuthenticatedUser() user: TokenInfo) {
    return this.processesService.sendToPreviousStage(+id, body, {
      user: user || { preferred_username: user?.preferred_username || '1724601234', name: 'admin previuos' },
    });
  }
}
