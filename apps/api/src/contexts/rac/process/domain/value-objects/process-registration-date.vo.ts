export class ProcessRegistrationDate {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid Registration Date: ${value}`);
    }
    this.value = value;
  }

  static now(): ProcessRegistrationDate {
    return new ProcessRegistrationDate(new Date().toISOString());
  }

  static from(value: string): ProcessRegistrationDate {
    return new ProcessRegistrationDate(value);
  }

  private isValid(value: string): boolean {
    const date = new Date(value);
    return date instanceof Date && !isNaN(date.getTime());
  }

  getValue(): string {
    return this.value;
  }

  toDate(): Date {
    return new Date(this.value);
  }
}
