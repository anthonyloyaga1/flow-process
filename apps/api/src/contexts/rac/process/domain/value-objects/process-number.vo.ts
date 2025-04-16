import { ProcessNumberNotValueException } from '../exceptions/process-number-not-value.exception';

export class ProcessNumber {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new ProcessNumberNotValueException(value);
    }
    this.value = value;
  }

  static create(serviceYear: number, boxNumber: number): ProcessNumber {
    const value = `${serviceYear}-${boxNumber.toString().padStart(3, '0')}`;
    return new ProcessNumber(value);
  }

  static from(value: string): ProcessNumber {
    return new ProcessNumber(value);
  }

  getValue(): string {
    return this.value;
  }

  private isValid(value: string): boolean {
    const regex = /^\d{4}-\d{3}$/;
    return regex.test(value);
  }
}
