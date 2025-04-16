import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';

import { AdvanceProcessStage } from '../../application/use-cases/advance-process-stage';
import { CreateProcess } from '../../application/use-cases/create-process';
import { FindAllProcess } from '../../application/use-cases/find-all-process';
import { ReturnProcessStage } from '../../application/use-cases/return-process';

@Controller('process')
export class ProcessController {
  constructor(
    private readonly createProcessUseCase: CreateProcess,
    private readonly advanceProcessStageUseCase: AdvanceProcessStage,
    private readonly returnProcessStageUseCase: ReturnProcessStage,
    private readonly findAllProcessService: FindAllProcess,
  ) {}
  @Post()
  @Public()
  create(@Body() createProcessDto: any) {
    return this.createProcessUseCase.execute(createProcessDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.findAllProcessService.execute();
  }

  @Patch(':id/advance')
  @Public()
  advanceStage(@Param('id') processId: string) {
    return this.advanceProcessStageUseCase.execute(processId);
  }

  @Patch(':id/return')
  @Public()
  returnStage(@Param('id') processId: string, @Body('returnStageId') returnStageId: string) {
    return this.returnProcessStageUseCase.execute(processId, returnStageId);
  }
}
