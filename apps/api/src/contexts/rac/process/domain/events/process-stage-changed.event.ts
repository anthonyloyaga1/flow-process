export class ProcessStageChangedEvent {
  constructor(
    public readonly processId: string,
    public readonly previousStageId: string,
    public readonly nextStageId: string,
  ) {}

  get name(): string {
    return 'ProcessStageChangedEvent';
  }
}
