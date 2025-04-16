import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { PaginateConfig } from 'nestjs-paginate';
import { ProvinceEntity } from 'src/modules/infraestructure/database/entities/province.entity';
import { provincesPaginateConfig } from 'src/modules/infraestructure/database/paging/provinces.paginate';

import { PagingModel, SuccessDoc } from '../../../../shared/base-class/doc-base';
import { ProvinceDto } from '../dto/province.dto';

const selectDocExamples = ['id', 'name', 'code'];
export const provincePaginateDocConfig: PaginateConfig<ProvinceEntity> = provincesPaginateConfig(selectDocExamples);

class ProvincePagingModel {
  @ApiProperty({ type: [ProvinceDto], description: 'Colección de organización' })
  collection: ProvinceDto[];
}

class ProvincePagingData extends IntersectionType(ProvincePagingModel, PagingModel<ProvinceDto>) {}

export class ProvincePagingDoc extends SuccessDoc {
  @ApiProperty({ type: ProvincePagingData, description: 'Datos de organización paginados' })
  data: ProvincePagingData;
}

export class ProvinceDoc extends SuccessDoc {
  @ApiProperty({ type: ProvinceDto, description: 'Datos de organización' })
  data: ProvinceDto;
}

export class ProvinceListDoc extends SuccessDoc {
  @ApiProperty({ type: [ProvinceDto], description: 'Datos de organización' })
  data: ProvinceDto[];
}
