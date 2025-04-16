import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import * as dayjs from 'dayjs';

export class PaymentShipmentBasicDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador del envío de pago' })
  id: number;

  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador del proceso asociado' })
  processId: number;

  @Expose()
  @ApiProperty({ example: dayjs().toDate(), description: 'Fecha de inicio en el estado actual' })
  currentStageStartDate: Date;

  @Expose()
  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de envío del pago' })
  paymentShipmentDate: string;

  @Expose()
  @ApiProperty({ example: '1234567890', description: 'Identificación del responsable del archivo' })
  fileResponsibleIdentifier: string;

  @Expose()
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del responsable del archivo' })
  fileResponsibleName: string;

  @Expose()
  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de envío del archivo' })
  fileShipmentDate: string;

  @Expose()
  @ApiPropertyOptional({ example: 'Observaciones sobre el envío', description: 'Observaciones' })
  observations?: string;

  @Expose()
  @ApiProperty({ example: 'Juan Perez', description: 'Nombre del usuario que crea el registro' })
  createdByName: string;

  @Expose()
  @ApiProperty({ example: 'JP', description: 'Iniciales del usuario que crea el registro' })
  createdByInitials: string;
}

export class PaymentShipmentDto extends PaymentShipmentBasicDto {}
