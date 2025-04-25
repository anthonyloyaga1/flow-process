import { ValidationException } from '@common/domain/exceptions/domain-errors';

export class InvalidProvinceException extends ValidationException {
  constructor(value: string) {
    super(`La provincia "${value}" es inválida.`);
    this.name = 'InvalidProvinceException';
  }
}
