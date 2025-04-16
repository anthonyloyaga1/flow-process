import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import * as dayjs from 'dayjs';

export class CreateMedicalControlDto {
  @ApiProperty({ example: 1, description: 'Identificador del proceso asociado' })
  @IsInt()
  processId: number;

  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de la revisión' })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: 'Motivo del retraso', description: 'Motivo del retraso' })
  @IsOptional()
  @IsString()
  delayReason?: string;

  @ApiPropertyOptional({ example: 'Detalles de los pacientes objetados', description: 'Detalles de los pacientes objetados' })
  @IsOptional()
  @IsString()
  objectedPatientsDetails?: string;

  @ApiPropertyOptional({ example: 5, description: 'Cantidad de expedientes objetados' })
  @IsOptional()
  @IsInt()
  objectedFilesCount?: number;

  @ApiPropertyOptional({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de entrega de los expedientes' })
  @IsOptional()
  @IsDateString()
  filesDeliveryDate?: string;
}
