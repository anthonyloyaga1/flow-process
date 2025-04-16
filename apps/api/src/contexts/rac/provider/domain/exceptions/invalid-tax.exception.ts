import { ValidationException } from '@errors/domain-errors';

export class InvalidTaxException extends ValidationException {
  constructor(value: string) {
    super(`El RUC "${value}" es inválido.`);
    this.name = 'InvalidTaxException';
  }
}
