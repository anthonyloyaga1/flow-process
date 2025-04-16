import { DomainException } from '@errors/domain-errors';

export class CannotReturnToStageException extends DomainException {
  constructor(returnStageName: string) {
    super(`No se puede retornar a la etapa ${returnStageName}`);
    this.name = 'CannotReturnToStageException';
  }
}
