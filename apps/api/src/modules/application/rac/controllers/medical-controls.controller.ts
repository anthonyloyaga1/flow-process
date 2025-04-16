import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, Resource, Scopes } from 'nest-keycloak-connect';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { TokenInfo } from '../../../../shared/interfaces/token-info.interface';
import { MedicalControlBasicDoc, MedicalControlDoc } from '../docs/medical-control.doc';
import { CreateMedicalControlDto } from '../dto/create-medical-control.dto';
import { UpdateMedicalControlDto } from '../dto/update-medical-control.dto';
import { MedicalControlsService } from '../services/medical-controls.service';

@ApiBearerAuth()
@ApiTags('Medical controls (Control Médico)')
@Controller('medical-controls')
@Resource('MedicalControls')
export class MedicalControlsController {
  constructor(private readonly medicalControlService: MedicalControlsService) {}

  @Post()
  @Scopes('create')
  @ApiOperation({ summary: 'Crear control médico' })
  @SwaggerResponses(MedicalControlBasicDoc)
  create(@Body() body: CreateMedicalControlDto, @AuthenticatedUser() user: TokenInfo) {
    return this.medicalControlService.create(body, {
      user: user || { preferred_username: user?.preferred_username || '1724601234', name: 'admin create' },
    });
  }

  @Get(':id')
  @Scopes('read')
  @ApiOperation({ summary: 'Obtener control médico por id' })
  @SwaggerResponses(MedicalControlDoc)
  findOneById(@Param('id') id: string) {
    return this.medicalControlService.findOneById(+id);
  }

  @Get('processId/:processId')
  @Scopes('read')
  @ApiOperation({ summary: 'Obtener control médico por Id del trámite' })
  @SwaggerResponses(MedicalControlDoc)
  findOneByProcessId(@Param('processId') processId: string) {
    return this.medicalControlService.findOneByProcessId(+processId);
  }

  @Put(':id')
  @Scopes('update')
  @ApiOperation({ summary: 'Actualizar control médico' })
  @SwaggerResponses(MedicalControlBasicDoc)
  update(@Param('id') id: string, @Body() body: UpdateMedicalControlDto, @AuthenticatedUser() user: TokenInfo) {
    return this.medicalControlService.update(+id, body, {
      user: user || { preferred_username: user?.preferred_username || '1724601234', name: 'admin update' },
    });
  }
}
