import { ValidationException } from '@errors/domain-errors';

export class InvalidIdException extends ValidationException {
  constructor(id: string) {
    super(`Invalid ID: ${id}`);
    this.name = 'InvalidIdException';
  }
}
