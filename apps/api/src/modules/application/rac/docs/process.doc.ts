import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { PaginateConfig } from 'nestjs-paginate';

import { PagingModel, SuccessDoc } from '../../../../shared/base-class/doc-base';
import { ProcessEntity } from '../../../infraestructure/database/entities/process.entity';
import { processesPaginateConfig } from '../../../infraestructure/database/paging/processes.paginate';
import { ProcessBasicDto, ProcessDto } from '../dto/process.dto';

const selectDocExample = ['id', 'requestedAmount', 'boxNumber', 'currentStageDate'];
export const processesPaginateDocConfig: PaginateConfig<ProcessEntity> = processesPaginateConfig(selectDocExample);

class ProcessPagingModel {
  @ApiProperty({ type: [ProcessDto], description: 'Colección de trámite' })
  collection: ProcessDto[];
}

class ProcessPagingData extends IntersectionType(ProcessPagingModel, PagingModel<ProcessDto>) {}

export class ProcessPagingDoc extends SuccessDoc {
  @ApiProperty({ type: ProcessPagingData, description: 'Datos de trámite paginados' })
  data: ProcessPagingData;
}

export class ProcessBasicDoc extends SuccessDoc {
  @ApiProperty({ type: ProcessBasicDto, description: 'Datos de trámite' })
  data: ProcessBasicDto;
}

export class ProcessDoc extends SuccessDoc {
  @ApiProperty({ type: ProcessDto, description: 'Datos de trámite' })
  data: ProcessDto;
}

export class ProcessListDoc extends SuccessDoc {
  @ApiProperty({ type: [ProcessDto], description: 'Datos de trámite' })
  data: ProcessDto[];
}
