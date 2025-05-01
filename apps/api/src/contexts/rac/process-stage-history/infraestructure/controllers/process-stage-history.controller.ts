import { Controller, Get } from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';

import { FindAllProcessStageHistoryUseCase } from '../../application/use-cases/find-all-process-stage-history';

@Controller('process-stage-history')
export class ProcessStageHistoryController {
  constructor(private readonly findAllProcessStageHistoryUseCase: FindAllProcessStageHistoryUseCase) {} // Replace 'any' with the actual type of the use case

  @Get()
  @Public()
  async findAll() {
    return this.findAllProcessStageHistoryUseCase.execute();
  }
}
