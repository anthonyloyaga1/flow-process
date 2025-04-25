import { ProcessStageChangedEvent } from '../events/process-stage-changed.event';
import { CannotAdvanceToStageException } from '../exceptions/cannot-advance-to-stage.exception';
import { CannotReturnToStageException } from '../exceptions/cannot-return-to-stage.exception';
import { ProcessLatestStageDate } from '../value-objects/process-latest-stage-date.vo';
import { Process } from './process.model';
import { Stage } from './stage.model';

export class ProcessActions {
  static advanceToNextStage(process: Process, currentStage: Stage): void {
    if (!currentStage.canAdvance()) throw new CannotAdvanceToStageException(currentStage.name);

    const previousStageId = process.currentStageId;
    process.currentStageId = currentStage.nextStageId;
    process.latestStageDate = ProcessLatestStageDate.now();

    process.apply(new ProcessStageChangedEvent({ id: process.id.getValue(), previousStageId, newStageId: currentStage.nextStageId }));
  }

  static returnToPreviousStage(process: Process, currentStage: Stage, returnStage: Stage): void {
    if (!currentStage.canReturnTo(returnStage.id)) throw new CannotReturnToStageException(returnStage.name);

    const previousStageId = process.currentStageId;
    process.currentStageId = returnStage.id;
    process.latestStageDate = ProcessLatestStageDate.now();

    process.apply(new ProcessStageChangedEvent({ id: process.id.getValue(), previousStageId, newStageId: returnStage.id }));
  }
}
