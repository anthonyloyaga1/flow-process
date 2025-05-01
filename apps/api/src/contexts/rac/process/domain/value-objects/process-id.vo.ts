import { v4 as uuidv4 } from 'uuid';

import { InvalidProcessIdException } from '../exceptions/invalid-process-id.exception';

export class ProcessId {
  readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new InvalidProcessIdException(value);
    }
    this.value = value;
  }

  static generate(): ProcessId {
    return new ProcessId(uuidv4());
  }

  static from(value: string): ProcessId {
    return new ProcessId(value);
  }

  private isValid(value: string): boolean {
    return /^[0-9a-fA-F-]{36}$/.test(value);
  }

  getValue(): string {
    return this.value;
  }
}
