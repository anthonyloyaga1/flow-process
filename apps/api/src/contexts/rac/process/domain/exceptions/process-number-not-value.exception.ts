import { ValidationException } from '@errors/domain-errors';

export class ProcessNumberNotValueException extends ValidationException {
  constructor(value: string) {
    super(`El valor "${value}" no es un número de proceso válido.`);
    this.name = 'ProcessNumberNotValueException';
  }
}
