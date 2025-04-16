import { InvalidProvinceException } from '../exceptions/invalid-province.exception';

export class ProviderProvince {
  private readonly province: string;

  private constructor(value: string) {
    if (!this.isValid(value)) throw new InvalidProvinceException(value);
    this.province = value;
  }

  static create(value: string): ProviderProvince {
    return new ProviderProvince(value);
  }

  static from(value: string): ProviderProvince {
    return new ProviderProvince(value);
  }

  private isValid(value: string): boolean {
    return value.length <= 50 && value.length >= 0;
  }

  getValue(): string {
    return this.province;
  }
}
