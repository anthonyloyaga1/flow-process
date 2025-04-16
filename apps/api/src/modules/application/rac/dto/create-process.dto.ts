import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import * as dayjs from 'dayjs';

export class CreateProcessDto {
  @ApiProperty({ example: 1, description: 'Identificador del prestador' })
  @IsInt()
  providerId: number;

  @ApiProperty({ example: true, description: 'Indica si el trámite es catastrófico' })
  @IsBoolean()
  isCatastrophic: boolean;

  @ApiProperty({ example: 1234, description: 'Cantidad de expedientes' })
  @IsInt()
  @Min(0)
  @Max(9999)
  @IsNotEmpty()
  fileCount: number;

  @ApiProperty({ example: parseInt(dayjs().format('M')), description: 'Mes de prestación' })
  @IsInt()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  serviceMonth: number;

  @ApiProperty({ example: dayjs().format('YYYY'), description: 'Año de prestación' })
  @IsInt()
  serviceYear: number;

  @ApiProperty({ example: true, description: 'Indica si el trámite tiene archivo' })
  @IsBoolean()
  hasFile: boolean;

  @ApiProperty({ example: 12345.67, description: 'Valor solicitado' })
  @IsNumber()
  @Min(0)
  @IsNumber({ maxDecimalPlaces: 2 })
  requestedAmount: number;

  @ApiProperty({ example: 19, description: 'Identificador del tipo de ingreso' })
  @IsInt()
  entryTypeId: number;

  @ApiProperty({ example: 16, description: 'Identificador del número de ingreso' })
  @IsInt()
  entryNumberId: number;

  @ApiProperty({ example: 3, description: 'Número de caja' })
  @IsInt()
  boxNumber: number;

  @ApiProperty({ example: 'Observaciones del trámite', description: 'Observaciones del trámite', maxLength: 2500 })
  @IsOptional()
  @IsString()
  @Length(0, 2500)
  observations?: string;

  @ApiProperty({ example: dayjs().format('YYYY-MM-DD'), description: 'Fecha de recepción del trámite' })
  @IsDateString()
  receptionDate: string;
}
