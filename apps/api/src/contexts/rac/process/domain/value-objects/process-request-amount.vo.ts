import { RequestedAmountNotValueException } from '../exceptions/request-amount-not-value.exception';

export class ProcessRequestedAmount {
  private readonly value: number;

  constructor(value: number) {
    if (!this.isValid(value)) {
      throw new RequestedAmountNotValueException(value);
    }
    this.value = value;
  }

  static create(value: number) {
    return new ProcessRequestedAmount(value);
  }

  static from(value: number) {
    return new ProcessRequestedAmount(value);
  }

  private isValid(value: number): boolean {
    return !isNaN(value) && value > 0;
  }

  getValue(): number {
    return this.value;
  }
}
