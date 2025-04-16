import { DomainException } from '@errors/domain-errors';

export class CannotAdvanceToStageException extends DomainException {
  constructor(nextStageName: string) {
    super(`No se puede avanzar a la etapa ${nextStageName}`);
    this.name = 'CannotAdvanceToStageException';
  }
}
