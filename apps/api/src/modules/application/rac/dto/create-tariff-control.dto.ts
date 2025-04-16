import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Length, Matches, Max } from 'class-validator';
import * as dayjs from 'dayjs';

export class CreateTariffControlDto {
  @ApiProperty({ example: 1, description: 'Identificador del proceso asociado' })
  @IsInt()
  processId: number;

  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de inicio de la liquidación' })
  @IsDateString()
  liquidationStartDate: string;

  @ApiProperty({ example: 942.42, description: 'Valor aprobado' })
  @IsNumber({ maxDecimalPlaces: 2 }) //CU005.FB6.1.1.3: :  Número decimal de 7 dígitos con 2 decimales
  @Max(9999999.99, { message: 'Value can be 7 digits and 2 decimals at most' }) //CU005.FB6.1.1.3: :  Número decimal de 7 dígitos con 2 decimales
  approvedValue: number;

  @ApiPropertyOptional({ example: 500.0, description: 'Valor objetado' })
  @IsNumber({ maxDecimalPlaces: 2 }) //CU005.FB6.1.1.3: :  Número decimal de 7 dígitos con 2 decimales
  @Max(9999999.99, { message: 'Value can be 7 digits and 2 decimals at most' }) //CU005.FB6.1.1.3: :  Número decimal de 7 dígitos con 2 decimales
  objectedValue: number;

  @ApiPropertyOptional({ example: 'Motivo del retraso', description: 'Motivo del retraso' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  delayReason?: string;

  @ApiPropertyOptional({ example: 1, description: 'Cantidad de expedientes objetados' })
  @IsOptional()
  @IsInt()
  @Max(999, { message: 'Value can be 3 digits at most' }) //CU005.FB6.1.2.1: :  Número entero de 3 dígitos
  objectedFilesCount?: number;

  @ApiPropertyOptional({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de entrega de expedientes' })
  @IsOptional()
  @IsDateString()
  filesDeliveryDate?: string;

  @ApiPropertyOptional({ example: 1, description: 'Cantidad de expedientes objetados por la ACFSS' })
  @IsOptional()
  @IsInt()
  objectedFilesCountACFSS?: number;

  @ApiPropertyOptional({ example: 'Detalles de los expedientes objetados', description: 'Detalles de los expedientes objetados' })
  @IsOptional()
  @IsString()
  @Length(1, 2000) //CU005.FB6.1.2.3: Texto de 2000 caracteres
  objectedFilesDetails?: string;

  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de envío de la gestión documental' })
  @IsDateString()
  documentManagementSendDate: string;

  @ApiProperty({ example: 'INF-13456-2024', description: 'Número de informe' })
  @IsString()
  @Length(1, 15) //CU005.FB6.1.3.2: Texto de 15 caracteres
  @Matches(/^[a-zA-Z0-9-]+$/, { message: 'reportNumber can only contain alphanumeric characters and hyphens' }) //CU005.FB6.1.3.2: Texto alfamumérico con guiones
  reportNumber: string;

  @ApiProperty({ example: 'MSP-MSP-2024-1021-M', description: 'Número de memorando' })
  @IsString()
  @Length(1, 30) //CU005.FB6.1.3.3: Texto de 30 caracteres
  @Matches(/^[a-zA-Z0-9-]+$/, { message: 'memorandumNumber can only contain alphanumeric characters and hyphens' }) //CU005.FB6.1.3.3: Texto alfamumérico con guiones
  memorandumNumber: string;

  @ApiProperty({ example: '1710173677', description: 'Identificación del responsable de gestión documental' })
  @IsString()
  @Length(1, 10) //CU005.FB6.1.3.3: Texto de 30 caracteres
  documentManagementResponsibleIdentifier: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombres del responsable de gestión documental' })
  @IsString()
  @Length(1, 50)
  documentManagementResponsibleName: string;
}
