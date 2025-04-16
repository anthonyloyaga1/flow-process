import { Module } from '@nestjs/common';

import { ProviderFinder } from './application/services/provider-finder.service';
import { PROVIDER_REPOSITORY } from './domain/repositories/provider.repository';
import { ProviderController } from './infraestructure/controllers/provider.controller';
import { InMemoryProviderRepository } from './infraestructure/persistence/repositories/in-memory-provider.repository';
import { FindAllProvidersUseCase } from './application/use-cases/find-all-providers.use-case';

@Module({
  controllers: [ProviderController],
  providers: [
    FindAllProvidersUseCase,
    {
      provide: PROVIDER_REPOSITORY, // Token para el repositorio
      useClass: InMemoryProviderRepository, // Implementación concreta
    },
    ProviderFinder,
  ],
  exports: [ProviderFinder],
})
export class ProviderModule {}
