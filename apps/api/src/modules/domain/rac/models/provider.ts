import { Type } from 'class-transformer';

import { ModelBase } from '../../../../shared/base-class/model-base';
import { ProviderGroup } from '../../common/models/provider-group';

export class Provider extends ModelBase {
  id: number;
  unicode: number;
  name: string;
  ruc: string;
  denomination: string;
  provinceCode: string;
  provinceDescription: string;
  zoneCode: string;
  zoneDescription: string;
  attentionLevel: string;
  providerGroupId: number;

  @Type(() => ProviderGroup)
  providerGroup: ProviderGroup;
}
