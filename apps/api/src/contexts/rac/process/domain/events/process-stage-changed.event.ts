import { DomainEvent } from '@common/domain/domain-event';

export class ProcessStageChangedEvent extends DomainEvent {
  static EVENT_NAME = 'process.stage.changed';

  constructor(params: { id: string; previousStageId: string; newStageId: string }) {
    super({ aggregateId: params.id, eventName: ProcessStageChangedEvent.EVENT_NAME, attributes: params });
  }
}
