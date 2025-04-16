import { Controller, Get } from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';

import { FindAllProvidersUseCase } from '../../application/use-cases/find-all-providers.use-case';

@Controller('provider')
export class ProviderController {
  constructor(private readonly findAllProvidersUseCase: FindAllProvidersUseCase) {}

  @Get()
  @Public()
  findAll() {
    return this.findAllProvidersUseCase.execute();
  }
}
