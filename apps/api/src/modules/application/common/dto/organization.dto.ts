import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import * as dayjs from 'dayjs';

import { ProvinceDto } from './province.dto';

export class OrganizationDto {
  @Expose()
  @ApiProperty({ example: 2, description: 'Identificador único de la organización' })
  id: number;

  @Expose()
  @ApiProperty({
    example: `[{\"use\":\"official\",\"type\":\"PRN\",\"value\":\"000002\",\"period_start\":null,\"period_end\":null,\"assigner\":\"RUES\"},{\"use\":\"secondary\",\"type\":\"TAX\",\"value\":\"0160054520001\",\"period_start\":null,\"period_end\":null,\"assigner\":\"SRI\"}]`,
    description: 'Identificador de la organización',
  })
  identifier: string;

  @Expose()
  @ApiProperty({ example: 'ZHUCAY', description: 'Nombre de la organización' })
  organizationName: string;

  @Expose()
  @ApiProperty({ example: 'ZHUCAY', description: 'Alias de la organización' })
  alias: string;

  @Expose()
  @ApiProperty({ example: `"[{\"coding\":\"prov\",\"text\":\"Healthcare Provider\"}]"`, description: 'Lista de tipos de organización' })
  organizationType: string;

  @Expose()
  @ApiProperty({
    example: ` "[{\"telecom\":[{\"system\":\"phone\",\"value\":\"074112823\",\"use\":\"work\"}],\"address\":[{\"use\":\"work\",\"type\":\"physical\",\"text\":\"TUTUPALI 1 ORDOÑEZ SN Y SN\",\"line\":\"CASA COMUNAL DE TUTUPALI CHICO\",\"district\":\"CUENCA\",\"state\":\"AZUAY\",\"postalcode\":\"010218\",\"country\":\"ECU\"}]}]"`,
    description: 'Lista de contactos',
  })
  contact: string;

  @Expose()
  @ApiProperty({
    example: `"[{\"type\":\"WORK\",\"description\":\"GPS position\",\"position\":{\"longitude\":\"716536.999998835\",\"latitude\":\"9672422.00000001\",\"altitude\":2644}},{\"type\":\"WORK\",\"description\":\"Google position\",\"position\":{\"longitude\":\"-2.96195290863206\",\"latitude\":\"-79.0518269243736\",\"altitude\":null}},{\"type\":\"WORK\",\"description\":\"other GPS position\",\"position\":{\"longitude\":\"-79.0518269243631\",\"latitude\":\"-2.96195290863218\",\"altitude\":null}}]"`,
    description: 'Lista de ubicaciones de la organización',
  })
  organizationLocation: string;

  @Expose()
  @ApiProperty({ example: 3, description: 'Identificador del tipo de entidad' })
  ecTypeEntityId: number;

  @Expose()
  @ApiProperty({ example: 'PUESTO DE SALUD', description: 'Nombre del tipo de entidad' })
  ecTypeEntityName: string;

  @Expose()
  @ApiProperty({ example: 213, description: 'Identificador del nivel' })
  ecLevelId: number;

  @Expose()
  @ApiProperty({ example: 'NIVEL 1', description: 'Nombre del nivel' })
  ecLevelName: string;

  @Expose()
  @ApiProperty({ example: 217, description: 'Identificador de la tipología' })
  ecTypologyId: number;

  @Expose()
  @ApiProperty({ example: 'PUESTO DE SALUD', description: 'Nombre de la tipología' })
  ecTypologyName: string;

  @Expose()
  @ApiProperty({ example: 209, description: 'Identificador de la institución' })
  ecInstitutionId: number;

  @Expose()
  @ApiProperty({ example: 'MSP', description: 'Nombre de la institución' })
  ecInstitutionName: string;

  @Expose()
  @ApiProperty({ example: 1, description: 'Identificador de la provincia' })
  ecProvinceId: number;

  @Expose()
  @ApiProperty({ example: '01', description: 'Código de la provincia' })
  ecProvinceCode: string;

  @Expose()
  @ApiProperty({ example: 'AZUAY', description: 'Nombre de la provincia' })
  ecProvinceName: string;

  @Expose()
  @ApiProperty({ example: 209, description: 'Identificador del cantón' })
  ecCantonId: number;

  @Expose()
  @ApiProperty({ example: '0101', description: 'Código del cantón' })
  ecCantonCode: string;

  @Expose()
  @ApiProperty({ example: 'CUENCA', description: 'Nombre del cantón' })
  ecCantonName: string;

  @Expose()
  @ApiProperty({ example: 912, description: 'Identificador de la parroquia' })
  ecParishId: number;

  @Expose()
  @ApiProperty({ example: '010168', description: 'Código de la parroquia' })
  ecParishCode: string;

  @Expose()
  @ApiProperty({ example: 'TARQUI', description: 'Nombre de la parroquia' })
  ecParishName: string;

  @Expose()
  @ApiProperty({ example: 3829, description: 'Identificador de la zona' })
  ecZoneId: number;

  @Expose()
  @ApiProperty({ example: 'Z06', description: 'Código de la zona' })
  ecZoneCode: string;

  @Expose()
  @ApiProperty({ example: 'AZUAY, CANAR, MORONA SANTIAGO', description: 'Distribución de la zona' })
  ecZoneDistribution: string;

  @Expose()
  @ApiProperty({ example: 'ZONA 6', description: 'Nombre de la zona' })
  ecZoneName: string;

  @Expose()
  @ApiProperty({ example: 3918, description: 'Identificador del distrito' })
  ecDistrictId: number;

  @Expose()
  @ApiProperty({ example: '01D02', description: 'Código del distrito' })
  ecDistrictCode: string;

  @Expose()
  @ApiProperty({
    example:
      'BAÑOS, CUMBE, CHAUCHA, MOLLETURO, TURI, VALLE, VICTORIA DEL PORTETE, TARQUI, GINGEO, SANTA ANA, SAN SEBASTIAN, EL BATAN, YANUNCAY, SUCRE, HUAYNA CAPAC, MONAY',
    description: 'Distribución del distrito',
  })
  ecDistrictDistribution: string;

  @Expose()
  @ApiProperty({ example: 1, description: 'Estado del permiso' })
  ecPermissionStatus: number;

  @Expose()
  @ApiProperty({ example: dayjs().toDate(), description: 'Fecha de actualización' })
  ecUpdatedAt: Date;

  @Expose()
  @ApiProperty({ example: dayjs().toDate(), description: 'Fecha de creación' })
  creationDate: Date;

  @Expose()
  @ApiProperty({ example: dayjs().toDate(), description: 'Fecha de modificación' })
  modificationDate: Date;

  @Expose()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Identificador del usuario que creó el registro' })
  userCreationId: string;

  @Expose()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001', description: 'Identificador del usuario que modificó el registro' })
  userModificationId: string;

  @Expose()
  @ApiProperty({ example: true, description: 'Indica si el registro está activo' })
  active: boolean;
}

export class OrganizationMinimalDto extends PickType(OrganizationDto, [
  'id',
  'organizationName',
  'alias',
  'ecZoneName',
  'ecDistrictDistribution',
  'ecPermissionStatus',
  'ecUpdatedAt',
  'active',
  'ecZoneCode',
]) {
  @Expose()
  @ApiProperty({ type: [ProvinceDto], description: 'Provincias' })
  @Type(() => ProvinceDto)
  zoneProvinces: ProvinceDto[];
}
