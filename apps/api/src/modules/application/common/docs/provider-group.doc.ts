import { ApiProperty } from '@nestjs/swagger';

import { SuccessDoc } from '../../../../shared/base-class/doc-base';
import { ProviderGroupDto } from '../dto/provider-group.dto';

export class ProviderGroupDoc extends SuccessDoc {
  @ApiProperty({ type: ProviderGroupDto, description: 'Datos de organización' })
  data: ProviderGroupDto;
}

export class ProviderGroupListDoc extends SuccessDoc {
  @ApiProperty({ type: [ProviderGroupDto], description: 'Datos de organización' })
  data: ProviderGroupDto[];
}
