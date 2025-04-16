import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import * as dayjs from 'dayjs';

import { ZoneCodesEnum } from '../../../../shared/constants/zone-codes.enum';

export class ReportFilterQuery {
  @ApiPropertyOptional({ example: 'Z01', description: 'Código de la zona' })
  @IsOptional()
  @IsEnum(ZoneCodesEnum)
  zoneCode: string;

  @ApiPropertyOptional({ example: '01', description: 'Código de la provincia' })
  @IsOptional()
  @IsString()
  provinceCode: string;

  @ApiPropertyOptional({ example: dayjs().subtract(7, 'day').format('YYYY-MM-DD'), description: 'Fecha de inicio' })
  @IsOptional()
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de fin' })
  @IsOptional()
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ example: 1, description: 'Identificador único del proveedor' })
  @IsOptional()
  @IsNumber()
  providerId: number;

  @ApiPropertyOptional({ example: 1, description: 'Identificador único de la etapa de proceso' })
  @IsOptional()
  @IsNumber()
  processStageId: number;
}
