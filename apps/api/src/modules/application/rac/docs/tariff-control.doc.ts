import { ApiProperty } from '@nestjs/swagger';

import { SuccessDoc } from '../../../../shared/base-class/doc-base';
import { TariffControlBasicDto, TariffControlDto } from '../../rac/dto/tariff-control.dto';

export class TariffControlBasicDoc extends SuccessDoc {
  @ApiProperty({ type: TariffControlBasicDto, description: 'Datos de trámite' })
  data: TariffControlBasicDto;
}

export class TariffControlDoc extends SuccessDoc {
  @ApiProperty({ type: TariffControlDto, description: 'Datos de trámite' })
  data: TariffControlDto;
}

export class TariffControlListDoc extends SuccessDoc {
  @ApiProperty({ type: [TariffControlDto], description: 'Datos de trámite' })
  data: TariffControlDto[];
}
