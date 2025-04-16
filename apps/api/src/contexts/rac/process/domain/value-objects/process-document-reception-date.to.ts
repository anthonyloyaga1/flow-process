import { DocumentReceptionDateNotValueException } from '../exceptions/document-reception-date.exception';
import { DateOutOfRangeException } from '../exceptions/invalid-document-reception-date.exception';

export class ProcessDocumentReceptionDate {
  private readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) throw new DocumentReceptionDateNotValueException(value);
    this.value = value;
  }

  static create(value: string): ProcessDocumentReceptionDate {
    const valueObject = new ProcessDocumentReceptionDate(value);
    if (!valueObject.isReceptionDateWithin7Days()) throw new DateOutOfRangeException(value);
    return valueObject;
  }

  static from(value: string): ProcessDocumentReceptionDate {
    return new ProcessDocumentReceptionDate(value);
  }

  private isValid(value: string): boolean {
    const date = new Date(value);
    return !isNaN(date.getTime()) && date.toString() !== 'Invalid Date';
  }

  private isReceptionDateWithin7Days(): boolean {
    const inputDate = this.toDate();
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    return inputDate <= now && inputDate >= sevenDaysAgo;
  }

  getValue(): string {
    return this.value;
  }

  toDate(): Date {
    return new Date(this.value);
  }
}
