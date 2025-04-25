import { ValidationException } from '@common/domain/exceptions/domain-errors';

export class InvalidProcessIdException extends ValidationException {
  constructor(value: string) {
    super(`The provided Process ID "${value}" is not a valid UUID.`);
    this.name = 'InvalidProcessIdException';
  }
}
