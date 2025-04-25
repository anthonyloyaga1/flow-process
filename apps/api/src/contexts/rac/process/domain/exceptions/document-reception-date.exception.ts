import { ValidationException } from '@common/domain/exceptions/domain-errors';

export class DocumentReceptionDateNotValueException extends ValidationException {
  constructor(value: string) {
    super(`El valor '${value}' no es un valor válido para la fecha de recepción del documento.`);
    this.name = 'DocumentReceptionDateNotValueException';
  }
}
