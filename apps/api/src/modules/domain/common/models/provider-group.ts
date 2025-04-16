import { ModelBase } from '../../../../shared/base-class/model-base';
import { CatalogDetail } from './catalog';

export class ProviderGroup extends ModelBase {
  id: number;
  name: string;
  providerGroupAggregatedId: number;
  providerGroupAggregated: CatalogDetail;
}
