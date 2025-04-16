import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Length } from 'class-validator';

import { ZoneCodesEnum } from '../../../../shared/constants/zone-codes.enum';

export class CreateProviderDto {
  @ApiProperty({ example: 12, description: 'Código único del proveedor' })
  @IsNumber()
  unicode: number;

  @ApiProperty({ example: 'LLACAO', description: 'Nombre del proveedor' })
  @IsString()
  @Length(0, 200)
  name: string;

  @ApiPropertyOptional({ example: '0160006710001', description: 'RUC del prestador' })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  ruc: string;

  @ApiPropertyOptional({ example: 'CENTRO DE SALUD TIPO A', description: 'Denominación del proveedor' })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  denomination: string;

  @ApiPropertyOptional({ example: '01', description: 'Código de la provincia' })
  @IsOptional()
  @IsString()
  @Length(1, 5)
  provinceCode: string;

  @ApiPropertyOptional({ example: 'AZUAY', description: 'Descripción de la provincia' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  provinceDescription: string;

  @ApiPropertyOptional({ example: 'Z01', description: 'Código de la zona' })
  @IsOptional()
  @IsEnum(ZoneCodesEnum)
  zoneCode: string;

  @ApiPropertyOptional({ example: 'ZONA 1', description: 'Descripción de la zona' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  zoneDescription: string;

  @ApiPropertyOptional({ example: 'NIVEL 1', description: 'Nivel de atención del prestador' })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  attentionLevel: string;

  @ApiProperty({ example: 1, description: 'Identificador del grupo de proveedores' })
  @IsInt()
  providerGroupId: number;
}
