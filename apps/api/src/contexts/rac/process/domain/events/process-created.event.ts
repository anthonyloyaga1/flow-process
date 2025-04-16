import { DomainEvent } from '@common/domain/domain-event';

export class ProcessCreatedEvent extends DomainEvent {
  static readonly EVENT_NAME = 'process.created';

  constructor(params: { id: string; providerId: string; catastrophic: string; fileCount: number; serviceMonth: string }) {
    super({ aggregateId: params.id, eventName: ProcessCreatedEvent.EVENT_NAME, attributes: params });
  }
}
