import { ValidationException } from '@errors/domain-errors';

export class InvalidDocumentReceptionDateException extends ValidationException {
  constructor() {
    super('La fecha de recepción documental debe estar entre 7 días antes y la fecha actual.');
    this.name = 'InvalidDocumentReceptionDateException';
  }
}

export class DateOutOfRangeException extends Error {
  constructor(value: string) {
    super(`La fecha de recepción (${value}) no está dentro de los últimos 7 días.`);
    this.name = 'DocumentReceptionDateOutOfRangeException';
  }
}
