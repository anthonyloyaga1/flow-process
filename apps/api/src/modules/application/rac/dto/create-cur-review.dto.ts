import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, IsPositive, IsString, Length, Max } from 'class-validator';
import * as dayjs from 'dayjs';

import { CurStatusEnum } from '../../../../shared/constants/cur-status.enum';

export class CreateCurReviewDto {
  @ApiProperty({ example: 1, description: 'Identificador del proceso asociado' })
  @IsInt()
  processId: number;

  @ApiPropertyOptional({ example: 123, description: 'Número CUR' })
  @IsOptional()
  @IsInt() //* CU006.FB6.1.1.1 No. De CUR (Obligatorio): Numérico entero de 7 dígitos
  @Max(9999999)
  @IsPositive()
  curNumber: number;

  @ApiPropertyOptional({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha CUR' })
  @IsOptional()
  @IsDateString()
  curDate: string;

  @ApiProperty({ example: 32, description: 'Estado del CUR 32. PENDIENTE DE ACREDITACIÓN, 33. PAGADO' })
  @IsEnum(CurStatusEnum)
  statusCurId: number;

  @ApiProperty({ example: '1234567890', description: 'Identificación del coordinador de zona' })
  @IsString()
  @Length(1, 10) //* CU008.FB6.1.1.5 Identificación del coordinador de zona (Obligatorio): Alfanumérico de 10 caracteres
  zoneCoordinatorIdentifier: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del coordinador de zona' })
  @IsString()
  @Length(1, 50) //* CU008.FB6.1.1.6 Nombre del coordinador de zona (Obligatorio): Texto de 50 caracteres
  zoneCoordinatorName: string;

  @ApiPropertyOptional({ example: 'Observaciones sobre el CUR', description: 'Observaciones' })
  @IsOptional()
  @IsString()
  @Length(0, 200) //* CU008.FB6.1.1.3 Observaciones (Opcional): Texto de 200 caracteres
  observations?: string;
}
