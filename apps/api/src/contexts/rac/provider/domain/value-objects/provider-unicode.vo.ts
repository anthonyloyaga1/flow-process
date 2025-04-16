export class ProviderUnicode {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): ProviderUnicode {
    return new ProviderUnicode(value);
  }

  static from(value: string): ProviderUnicode {
    return new ProviderUnicode(value);
  }

  getValue(): string {
    return this.value;
  }
}
