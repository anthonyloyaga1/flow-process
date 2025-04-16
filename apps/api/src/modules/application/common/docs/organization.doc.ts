import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { PaginateConfig } from 'nestjs-paginate';
import { organizationPaginateConfig } from 'src/modules/infraestructure/database/paging/organization-paginate';

import { PagingModel, SuccessDoc } from '../../../../shared/base-class/doc-base';
import { OrganizationDto, OrganizationMinimalDto } from '../dto/organization.dto';
import { OrganizationEntity } from 'src/modules/infraestructure/database/entities/organization.entity';

const selectDocExamples = ['id', 'organizationName', 'ecProvinceName', 'ecZoneName'];

export const organizationPaginateDocConfig: PaginateConfig<OrganizationEntity> = organizationPaginateConfig(selectDocExamples);

class OrganizationPagingModel {
  @ApiProperty({ type: [OrganizationDto], description: 'Colección de organización' })
  collection: OrganizationDto[];
}

class OrganizationPagingData extends IntersectionType(OrganizationPagingModel, PagingModel<OrganizationDto>) {}

export class OrganizationPagingDoc extends SuccessDoc {
  @ApiProperty({ type: OrganizationPagingData, description: 'Datos de organización paginados' })
  data: OrganizationPagingData;
}

export class OrganizationDoc extends SuccessDoc {
  @ApiProperty({ type: OrganizationDto, description: 'Datos de organización' })
  data: OrganizationDto;
}

export class OrganizationListDoc extends SuccessDoc {
  @ApiProperty({ type: [OrganizationDto], description: 'Datos de organización' })
  data: OrganizationDto[];
}

export class OrganizationListMinimalDoc extends SuccessDoc {
  @ApiProperty({ type: OrganizationMinimalDto, description: 'Datos de organización' })
  data: OrganizationMinimalDto;
}
