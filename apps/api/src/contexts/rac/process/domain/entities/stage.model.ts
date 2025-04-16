export class Stage {
  id: string;
  name: string;
  nextStageId?: string;
  returnStages: string[];

  constructor(params: { id: string; name: string; nextStageId?: string; returnStages?: string[] }) {
    this.id = params.id;
    this.name = params.name;
    this.nextStageId = params.nextStageId;
    this.returnStages = params.returnStages || [];
  }

  canAdvance(): boolean {
    return !!this.nextStageId;
  }

  canReturnTo(stageId: string): boolean {
    return this.returnStages.includes(stageId);
  }
}
