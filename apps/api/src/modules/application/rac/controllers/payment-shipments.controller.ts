import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, Resource, Scopes } from 'nest-keycloak-connect';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { TokenInfo } from '../../../../shared/interfaces/token-info.interface';
import { PaymentShipmentBasicDoc, PaymentShipmentDoc } from '../docs/payment-shipment.doc';
import { CreatePaymentShipmentDto } from '../dto/create-payment-shipment.dto';
import { UpdatePaymentShipmentDto } from '../dto/update-payment-shipment.dto';
import { PaymentShipmentsService } from '../services/payment-shipments.service';

@ApiBearerAuth()
@ApiTags('Payment shipments (Envíos de pago)')
@Controller('payment-shipments')
@Resource('PaymentShipments')
export class PaymentShipmentsController {
  constructor(private readonly paymentShipmentService: PaymentShipmentsService) {}

  @Post()
  @Scopes('create')
  @ApiOperation({ summary: 'Crear revisión documental' })
  @SwaggerResponses(PaymentShipmentBasicDoc)
  create(@Body() body: CreatePaymentShipmentDto, @AuthenticatedUser() user: TokenInfo) {
    return this.paymentShipmentService.create(body, {
      user: user || { preferred_username: user?.preferred_username || '1724601234', name: 'admin create' },
    });
  }

  @Get(':id')
  @Scopes('read')
  @ApiOperation({ summary: 'Obtener revisión documental por id' })
  @SwaggerResponses(PaymentShipmentDoc)
  findOneById(@Param('id') id: string) {
    return this.paymentShipmentService.findOneById(+id);
  }

  @Get('processId/:processId')
  @Scopes('read')
  @ApiOperation({ summary: 'Obtener revisión documental por Id del trámite' })
  @SwaggerResponses(PaymentShipmentDoc)
  findOneByProcessId(@Param('processId') processId: string) {
    return this.paymentShipmentService.findOneByProcessId(+processId);
  }

  @Put(':id')
  @Scopes('update')
  @ApiOperation({ summary: 'Actualizar revisión documental' })
  @SwaggerResponses(PaymentShipmentBasicDoc)
  update(@Param('id') id: string, @Body() body: UpdatePaymentShipmentDto, @AuthenticatedUser() user: TokenInfo) {
    return this.paymentShipmentService.update(+id, body, {
      user: user || { preferred_username: user?.preferred_username || '1724601234', name: 'admin update' },
    });
  }
}
