import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { PaginateConfig } from 'nestjs-paginate';
import { ProviderEntity } from 'src/modules/infraestructure/database/entities/provider.entity';
import { providersPaginateConfig } from 'src/modules/infraestructure/database/paging/providers.paginate';

import { PagingModel, SuccessDoc } from '../../../../shared/base-class/doc-base';
import { ProviderBasicDto, ProviderDto } from '../../rac/dto/provider.dto';

const selectDocExamples = ['id', 'name', 'unicode'];

export const providersPaginateDocConfig: PaginateConfig<ProviderEntity> = providersPaginateConfig(selectDocExamples);

class ProviderPagingModel {
  @ApiProperty({ type: [ProviderDto], description: 'Colección de catálogos' })
  collection: ProviderDto[];
}

class ProviderPagingData extends IntersectionType(ProviderPagingModel, PagingModel<ProviderDto>) {}

export class ProviderPagingDoc extends SuccessDoc {
  @ApiProperty({ type: ProviderPagingData, description: 'Datos de catálogo paginados' })
  data: ProviderPagingData;
}

export class ProviderBasicDoc extends SuccessDoc {
  @ApiProperty({ type: ProviderBasicDto, description: 'Datos de catálogo' })
  data: ProviderBasicDto;
}

export class ProviderDoc extends SuccessDoc {
  @ApiProperty({ type: ProviderDto, description: 'Datos de catálogo' })
  data: ProviderDto;
}
