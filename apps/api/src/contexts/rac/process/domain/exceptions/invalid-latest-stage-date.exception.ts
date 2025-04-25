import { ValidationException } from '@common/domain/exceptions/domain-errors';

export class InvalidLatestStageDateException extends ValidationException {
  constructor(value: string) {
    super(`The provided latest stage date "${value}" is not a valid date.`);
    this.name = 'InvalidLatestStageDateException';
  }
}
