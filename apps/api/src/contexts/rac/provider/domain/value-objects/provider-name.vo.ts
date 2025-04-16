import { InvalidNameException } from '../exceptions/invalid-name.exception';

export class ProviderName {
  private readonly name: string;

  private constructor(value: string) {
    if (!this.isValid(value)) throw new InvalidNameException(value);
    this.name = value;
  }

  static create(value: string): ProviderName {
    return new ProviderName(value);
  }

  static from(value: string): ProviderName {
    return new ProviderName(value);
  }

  private isValid(value: string): boolean {
    return value.length <= 50 && value.length >= 0;
  }

  getValue(): string {
    return this.name;
  }
}
