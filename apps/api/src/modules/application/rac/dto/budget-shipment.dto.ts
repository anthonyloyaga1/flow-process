import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import * as dayjs from 'dayjs';

import { DtoBase } from '../../../../shared/base-class/dto-base';

export class BudgetShipmentBasicDto extends DtoBase {
  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador del registro' })
  id: number;

  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador del proceso asociado' })
  processId: number;

  @Expose()
  @ApiProperty({ example: dayjs().toDate(), description: 'Fecha de inicio en el estado actual' })
  currentStageStartDate: Date;

  @Expose()
  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de solicitud del presupuesto' })
  budgetRequestDate: string;

  @Expose()
  @ApiPropertyOptional({ example: 'Observaciones sobre el presupuesto', description: 'Observaciones' })
  observations?: string;

  @Expose()
  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de solicitud de la factura' })
  invoiceRequestDate: string;

  @Expose()
  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de entrega de la factura' })
  invoiceDeliveryDate: string;

  @Expose()
  @ApiProperty({ example: 'INV-12345', description: 'Número de factura' })
  invoiceNumber: string;

  @Expose()
  @ApiProperty({ example: 'Juan Perez', description: 'Nombre del usuario que crea el registro' })
  createdByName: string;

  @Expose()
  @ApiProperty({ example: 'JP', description: 'Iniciales del usuario que crea el registro' })
  createdByInitials: string;
}

export class BudgetShipmentDto extends BudgetShipmentBasicDto {}
