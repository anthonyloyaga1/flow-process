import { EntryNumberEnum } from '../enums/entry-number.enum';
import { EntryNumberNotValueException } from '../exceptions/entry-number-not-value.exception';

export class ProcessEntryNumber {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new EntryNumberNotValueException(value);
    }
    this.value = value;
  }

  static create(value: string): ProcessEntryNumber {
    return new ProcessEntryNumber(value);
  }

  static from(value: string): ProcessEntryNumber {
    return new ProcessEntryNumber(value);
  }

  private isValid(value: string): boolean {
    return Object.values(EntryNumberEnum).includes(value as EntryNumberEnum);
  }

  getValue(): string {
    return this.value;
  }
}
