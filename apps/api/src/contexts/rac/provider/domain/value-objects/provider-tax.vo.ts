import { InvalidTaxException } from '../exceptions/invalid-tax.exception';

export class ProviderTax {
  private readonly taxId: string;

  private constructor(value: string) {
    if (!this.isValid(value)) throw new InvalidTaxException(value);
    this.taxId = value;
  }

  static create(value: string): ProviderTax {
    return new ProviderTax(value);
  }

  static from(value: string): ProviderTax {
    return new ProviderTax(value);
  }

  private isValid(value: string): boolean {
    return value.length <= 13 && value.length >= 0 && /^\d+$/.test(value);
  }

  getValue(): string {
    return this.taxId;
  }
}
