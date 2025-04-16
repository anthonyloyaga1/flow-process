import { ApiProperty } from '@nestjs/swagger';

import { SuccessDoc } from '../../../../shared/base-class/doc-base';
import { StageProcessDto } from '../dto/stage-process.dto';

export class StageProcessDoc extends SuccessDoc {
  @ApiProperty({ type: StageProcessDto, description: 'Datos de estados del trámite' })
  data: StageProcessDto;
}

export class StageProcessListDoc extends SuccessDoc {
  @ApiProperty({ type: [StageProcessDto], description: 'Datos de lista de estados del trámite' })
  data: StageProcessDto[];
}
