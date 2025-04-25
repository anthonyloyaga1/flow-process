import { ValidationException } from '@common/domain/exceptions/domain-errors';

export class InvalidNameException extends ValidationException {
  constructor(value: string) {
    super(`El nombre "${value}" es inválido.`);
    this.name = 'InvalidNameException';
  }
}
