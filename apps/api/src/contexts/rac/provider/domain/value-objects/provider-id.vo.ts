export class ProviderId {
  private readonly value: string;

  private constructor(value: string) {
    if (!this.isValid(value)) throw new Error(`Invalid ProviderId: ${value}`);
    this.value = value;
  }

  static create(value: string): ProviderId {
    return new ProviderId(value);
  }

  static from(value: string): ProviderId {
    return new ProviderId(value);
  }

  private isValid(value: string): boolean {
    return !!value;
  }

  getValue(): string {
    return this.value;
  }
}
