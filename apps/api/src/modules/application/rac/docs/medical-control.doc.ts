import { ApiProperty } from '@nestjs/swagger';

import { SuccessDoc } from '../../../../shared/base-class/doc-base';
import { MedicalControlBasicDto, MedicalControlDto } from '../dto/medical-control.dto';

export class MedicalControlBasicDoc extends SuccessDoc {
  @ApiProperty({ type: MedicalControlBasicDto, description: 'Datos de trámite' })
  data: MedicalControlBasicDto;
}

export class MedicalControlDoc extends SuccessDoc {
  @ApiProperty({ type: MedicalControlDto, description: 'Datos de trámite' })
  data: MedicalControlDto;
}

export class MedicalControlListDoc extends SuccessDoc {
  @ApiProperty({ type: [MedicalControlDto], description: 'Datos de trámite' })
  data: MedicalControlDto[];
}
