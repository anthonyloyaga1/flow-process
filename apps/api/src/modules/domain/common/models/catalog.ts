import { ModelBase } from '../../../../shared/base-class/model-base';

export class CatalogHeader extends ModelBase {
  id: number;
  name: string;
  description: string;
}

export class CatalogDetail extends ModelBase {
  id: number;
  name: string;
  numericValue: number;
  characterValue: string;
  catalogHeaderId: number;
  catalogHeader: CatalogHeader;
}
