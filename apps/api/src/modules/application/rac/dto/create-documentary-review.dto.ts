import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import * as dayjs from 'dayjs';

import { UpdateRestoreStageProcessDto } from './update-process.dto';

export class CreateDocumentaryReviewDto {
  @ApiProperty({ example: 1, description: 'Identificador del proceso asociado' })
  @IsInt()
  processId: number;

  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de la revisión' })
  @IsDateString()
  reviewDate: string;

  @ApiPropertyOptional({ example: 'Motivo del retraso', description: 'Motivo del retraso' })
  @IsOptional()
  @IsString()
  @Length(1, 200) //CU003-FB6.1.1.2: Validación cantidad de caracteres en delayReason 200
  delayReason: string;

  @ApiPropertyOptional({ example: 'Detalles de los pacientes objetados', description: 'Detalles de los pacientes objetados' })
  @IsOptional()
  @IsString()
  @Length(1, 2000) //CU003-FB6.1.2.3: Validación cantidad de caracteres en delayReason 2000
  objectedPatientsDetails?: string;

  @ApiPropertyOptional({ example: 5, description: 'Cantidad de expedientes objetados' })
  @IsOptional()
  @IsInt()
  objectedFilesCount?: number;

  @ApiPropertyOptional({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de entrega de los expedientes' })
  @IsOptional()
  @IsDateString()
  filesDeliveryDate?: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateRestoreStageProcessDto)
  process?: UpdateRestoreStageProcessDto;
}
