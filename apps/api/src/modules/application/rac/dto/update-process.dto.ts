import { ApiProperty, ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import * as dayjs from 'dayjs';

import { CreateProcessDto } from './create-process.dto';

//* CU_002.SF01.5.2.1 Inhabilita los campos:
// - Nro de trámite
// - Coordinación Zonal del prestador
// - Tipo de servicio
// - Mes de prestación
// - Año de prestación
// - Número de ingreso
export class UpdateProcessDto extends OmitType(PartialType(CreateProcessDto), [
  'providerId',
  'entryTypeId',
  'entryNumberId',
  'serviceMonth',
  'serviceYear',
]) {
  @ApiPropertyOptional({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de segunda recepción del trámite' })
  @IsOptional()
  @IsDateString()
  secondReceptionDate: string;
}

export class UpdateRestoreStageProcessDto {
  @ApiProperty({ example: 1, description: 'Identificador de la etapa de retorno' })
  @IsInt()
  returnStageId: number;

  @ApiPropertyOptional({ example: false, description: 'Indica si el trámite es rechazado' })
  @IsOptional()
  @IsBoolean()
  rejected?: boolean;

  @ApiProperty({ example: 'Motivo de retorno', description: 'Motivo del retorno' })
  @IsOptional()
  @IsString()
  returnStageReason?: string;
}
