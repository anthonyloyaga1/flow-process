import { v4 as uuidv4 } from 'uuid';

import { InvalidProcessStageHistoryIdException } from '../exceptions/invalid-process-history-id.exception';

export class ProcessStageHistoryId {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new InvalidProcessStageHistoryIdException('Invalid ProcessStageHistory ID');
    }
  }

  static generate(): ProcessStageHistoryId {
    return new ProcessStageHistoryId(uuidv4());
  }

  static from(value: string): ProcessStageHistoryId {
    return new ProcessStageHistoryId(value);
  }

  private isValid(value: string): boolean {
    return /^[0-9a-fA-F-]{36}$/.test(value);
  }

  getValue(): string {
    return this.value;
  }
}
