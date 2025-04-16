import { FilterOperator, PaginateConfig } from 'nestjs-paginate';

import { ProcessEntity } from '../entities/process.entity';

export const processesPaginateConfig = (query?: string[]): PaginateConfig<ProcessEntity> => ({
  select: query,
  sortableColumns: ['id', 'caseNumber', 'provider.provinceDescription', 'provider.name', 'currentStageDate', 'status.name'],
  filterableColumns: {
    id: [FilterOperator.EQ],
    caseNumber: [FilterOperator.EQ, FilterOperator.ILIKE, FilterOperator.SW],
    'provider.provinceDescription': [FilterOperator.ILIKE, FilterOperator.EQ, FilterOperator.SW],
    'provider.name': [FilterOperator.ILIKE, FilterOperator.EQ, FilterOperator.SW],
    currentStageDate: [FilterOperator.EQ, FilterOperator.GTE, FilterOperator.LTE, FilterOperator.GT, FilterOperator.LT],
    statusId: [FilterOperator.EQ],
    currentStageId: [FilterOperator.EQ, FilterOperator.IN],
    'provider.zoneCode': [FilterOperator.EQ],
    'provider.unicode': [FilterOperator.EQ],
  },
  relations: [
    'entryType',
    'entryNumber',
    'provider',
    'provider.providerGroup',
    'provider.providerGroup.providerGroupAggregated',
    'currentStage',
    'returnStage',
    'status',
    'documentaryReview',
    'medicalControl',
    'tariffControl',
    'budgetShipment',
    'paymentShipment',
    'curReview',
  ],
  where: { active: true },
});
