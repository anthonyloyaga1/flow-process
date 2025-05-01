export type ProcessStageHistoryPrimitives = {
  id: string;
  processId: string;
  newStageId: string;
  previousStageId: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
};
