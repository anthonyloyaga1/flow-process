import { Controller, Get } from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';

@Controller()
export class ProcessStages {
  // constructor(private readonly processStageService: ProcessStagesService) {}

  @Public()
  @Get('process-stages')
  async getProcessStages() {
    return [
      { id: '1', name: 'Stage 1' },
      { id: '2', name: 'Stage 2' },
      { id: '3', name: 'Stage 3' },
    ];
  }
}
