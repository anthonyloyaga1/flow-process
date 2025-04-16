import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { DtoBase } from '../../../../shared/base-class/dto-base';
import { ProviderGroupDto } from '../../common/dto/provider-group.dto';

export class ProviderBasicDto extends DtoBase {
  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador único del proveedor' })
  id: number;

  @Expose()
  @ApiProperty({ example: '000012', description: 'Código único del proveedor' })
  unicode: number;

  @Expose()
  @ApiProperty({ example: 'LLACAO', description: 'Nombre del proveedor' })
  name: string;

  @Expose()
  @ApiProperty({ example: '1234567890', description: 'RUC del proveedor' })
  ruc: string;

  @Expose()
  @ApiProperty({ example: 'CENTRO DE SALUD TIPO A', description: 'Denominación del proveedor' })
  denomination: string;

  @Expose()
  @ApiProperty({ example: '01', description: 'Código de la provincia' })
  provinceCode: string;

  @Expose()
  @ApiProperty({ example: 'AZUAY', description: 'Descripción de la provincia' })
  provinceDescription: string;

  @Expose()
  @ApiProperty({ example: 'Z06', description: 'Código de la zona' })
  zoneCode: string;

  @Expose()
  @ApiProperty({ example: 'ZONA 6', description: 'Descripción de la zona' })
  zoneDescription: string;

  @Expose()
  @ApiProperty({ example: 'NIVEL 1', description: 'Nivel de atención del proveedor' })
  attentionLevel: string;

  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador del grupo de proveedores' })
  providerGroupId: number;
}

export class ProviderDto extends ProviderBasicDto {
  @Expose()
  @Type(() => ProviderGroupDto)
  @ApiProperty({ type: ProviderGroupDto, description: 'Grupo de proveedores' })
  providerGroup: ProviderGroupDto;
}
