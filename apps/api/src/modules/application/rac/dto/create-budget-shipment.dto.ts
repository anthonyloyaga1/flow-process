import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, Length, Matches } from 'class-validator';
import * as dayjs from 'dayjs';

export class CreateBudgetShipmentDto {
  @ApiProperty({ example: 1, description: 'Identificador del proceso asociado' })
  @IsInt()
  processId: number;

  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de solicitud del presupuesto' })
  @IsDateString()
  budgetRequestDate: string;

  @ApiPropertyOptional({ example: 'Observaciones sobre el presupuesto', description: 'Observaciones' })
  @IsOptional()
  @IsString()
  @Length(1, 200) //* CU006.FB6.1.1.2: Texto de 200 caracteres.
  observations?: string;

  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de solicitud de la factura' })
  @IsDateString()
  invoiceRequestDate: string;

  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de entrega de la factura' })
  @IsDateString()
  invoiceDeliveryDate: string;

  @ApiProperty({ example: 'INV12345', description: 'Número de factura' })
  @IsString()
  @Matches(/^[a-zA-Z0-9-]+$/, { message: 'invoiceNumber: only alphanumeric and hyphen characters are allowed' })
  @Length(1, 20) //* CU006.FB6.1.1.5:  No. De factura (Obligatorio): Alfanumérico de 20 caracteres
  invoiceNumber: string;
}
