import { HttpException, HttpStatus } from '@nestjs/common';

import { DomainException, ValidationException } from '../../../contexts/common/domain/exceptions/domain-errors';

export class DomainExceptionMapper {
  static toHttpException(error: Error): HttpException {
    if (error instanceof HttpException) return error;

    // Ejemplo: Manejar errores específicos
    if (error instanceof DomainException) return new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    if (error instanceof ValidationException) return new HttpException(error.message, HttpStatus.BAD_REQUEST);

    // Mapeo genérico para otros errores
    return new HttpException(error.message || 'Ocurrió un error inesperado', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
