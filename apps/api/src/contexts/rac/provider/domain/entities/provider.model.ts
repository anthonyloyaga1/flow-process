import { AggregateRoot } from '@nestjs/cqrs';

import { ProviderId } from '../value-objects/provider-id.vo';
import { ProviderName } from '../value-objects/provider-name.vo';
import { ProviderProvince } from '../value-objects/provider-province.vo';
import { ProviderTax } from '../value-objects/provider-tax.vo';
import { ProviderUnicode } from '../value-objects/provider-unicode.vo';

export class Provider extends AggregateRoot {
  readonly id: ProviderId;
  name: ProviderName;
  unicode: ProviderUnicode;
  taxId: ProviderTax;
  province: ProviderProvince;

  constructor(params: { id: ProviderId; name: ProviderName; unicode: ProviderUnicode; taxId: ProviderTax; province: ProviderProvince }) {
    super();
    Object.assign(this, params);
  }

  static create(params: { id: ProviderId; name: ProviderName; unicode: ProviderUnicode; taxId: ProviderTax; province: ProviderProvince }) {
    return new Provider({ ...params });
  }

  static fromPrimitives(params: { id: string; name: string; unicode: string; taxId: string; province: string }) {
    return new Provider({
      id: ProviderId.from(params.id),
      name: ProviderName.from(params.name),
      unicode: ProviderUnicode.from(params.unicode),
      taxId: ProviderTax.from(params.taxId),
      province: ProviderProvince.from(params.province),
    });
  }

  toPrimitives() {
    return {
      id: this.id.getValue(),
      name: this.name.getValue(),
      unicode: this.unicode.getValue(),
      taxId: this.taxId.getValue(),
      province: this.province.getValue(),
    };
  }
}
