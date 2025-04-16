import { ValidationException } from '@errors/domain-errors';

export class RequestedAmountNotValueException extends ValidationException {
  constructor(value: number) {
    super(`El valor '${value}' no es un valor válido para la cantidad solicitada.`);
    this.name = 'RequestedAmountNotValueException';
  }
}
