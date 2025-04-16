import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import * as dayjs from 'dayjs';

export class CreatePaymentShipmentDto {
  @ApiProperty({ example: 1, description: 'Identificador del proceso asociado' })
  @IsInt()
  @IsNotEmpty()
  processId: number;

  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de envío del pago' })
  @IsDateString()
  paymentShipmentDate: string;

  @ApiProperty({ example: '1234567890', description: 'Identificación del responsable del archivo' })
  @IsString()
  @Length(1, 10) //* CU007.FB6.1.1.3:  Numérico entero de 10 dígitos
  fileResponsibleIdentifier: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del responsable del archivo' })
  @IsString()
  @Length(1, 50)
  fileResponsibleName: string;

  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de envío del archivo' })
  @IsDateString()
  fileShipmentDate: string;

  @ApiPropertyOptional({ example: 'Observaciones sobre el envío', description: 'Observaciones' })
  @IsOptional()
  @IsString()
  @Length(0, 200) //* CU007.FB6.1.1.3: Texto de 200 caracteres.
  observations?: string;
}
