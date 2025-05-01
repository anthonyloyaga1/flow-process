import { ValidationException } from '@common/domain/exceptions/domain-errors';

export class InvalidProcessStageHistoryIdException extends ValidationException {
  constructor(id: string) {
    super(`Invalid process stage history ID: ${id}`);
    this.name = 'InvalidProcessStageHistoryIdException';
  }
}
