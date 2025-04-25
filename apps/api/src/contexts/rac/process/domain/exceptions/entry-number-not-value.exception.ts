import { ValidationException } from '@common/domain/exceptions/domain-errors';

export class EntryNumberNotValueException extends ValidationException {
  constructor(value: string) {
    super(`El valor '${value}' no es un valor válido para el número de entrada.`);
    this.name = 'EntryNumberNotValueException';
  }
}
