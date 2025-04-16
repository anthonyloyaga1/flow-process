import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, Resource, Scopes } from 'nest-keycloak-connect';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { TokenInfo } from '../../../../shared/interfaces/token-info.interface';
import { BudgetShipmentBasicDoc, BudgetShipmentDoc } from '../docs/budget-shipment.doc';
import { CreateBudgetShipmentDto } from '../dto/create-budget-shipment.dto';
import { UpdateBudgetShipmentDto } from '../dto/update-budget-shipment.dto';
import { BudgetShipmentsService } from '../services/budget-shipments.service';

@ApiBearerAuth()
@ApiTags('Budget shipments (Envío de presupuestos)')
@Controller('budget-shipments')
@Resource('BudgetShipments')
export class BudgetShipmentsController {
  constructor(private readonly budgetShipmentService: BudgetShipmentsService) {}

  @Post()
  @Scopes('create')
  @ApiOperation({ summary: 'Crear revisión documental' })
  @SwaggerResponses(BudgetShipmentBasicDoc)
  create(@Body() body: CreateBudgetShipmentDto, @AuthenticatedUser() user: TokenInfo) {
    return this.budgetShipmentService.create(body, {
      user: user || { preferred_username: user?.preferred_username || '1724601234', name: 'admin create' },
    });
  }

  @Get(':id')
  @Scopes('read')
  @ApiOperation({ summary: 'Obtener revisión documental por id' })
  @SwaggerResponses(BudgetShipmentDoc)
  findOneById(@Param('id') id: string) {
    return this.budgetShipmentService.findOneById(+id);
  }

  @Get('processId/:processId')
  @Scopes('read')
  @ApiOperation({ summary: 'Obtener revisión documental por Id del trámite' })
  @SwaggerResponses(BudgetShipmentDoc)
  findOneByProcessId(@Param('processId') processId: string) {
    return this.budgetShipmentService.findOneByProcessId(+processId);
  }

  @Put(':id')
  @Scopes('update')
  @ApiOperation({ summary: 'Actualizar revisión documental' })
  @SwaggerResponses(BudgetShipmentBasicDoc)
  update(@Param('id') id: string, @Body() body: UpdateBudgetShipmentDto, @AuthenticatedUser() user: TokenInfo) {
    return this.budgetShipmentService.update(+id, body, {
      user: user || { preferred_username: user?.preferred_username || '1724601234', name: 'admin update' },
    });
  }
}
