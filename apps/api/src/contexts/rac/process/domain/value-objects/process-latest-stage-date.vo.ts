import { InvalidLatestStageDateException } from '../exceptions/invalid-latest-stage-date.exception';

export class ProcessLatestStageDate {
  private value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new InvalidLatestStageDateException(value);
    }
    this.value = value;
  }

  static create(value: string): ProcessLatestStageDate {
    return new ProcessLatestStageDate(value);
  }

  static now(): ProcessLatestStageDate {
    const date = new Date();
    return new ProcessLatestStageDate(date.toISOString());
  }

  static from(value: string): ProcessLatestStageDate {
    return new ProcessLatestStageDate(value);
  }

  private isValid(value: string): boolean {
    return !isNaN(Date.parse(value));
  }

  getValue(): string {
    return this.value;
  }
}
