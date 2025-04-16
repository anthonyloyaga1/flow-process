import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { PROVIDER_REPOSITORY, ProviderRepository } from '../../domain/repositories/provider.repository';

@Injectable()
export class ProviderFinder {
  constructor(@Inject(PROVIDER_REPOSITORY) private readonly providerRepository: ProviderRepository) {}

  async findProvider(providerId: string) {
    const provider = await this.providerRepository.findById(providerId);
    if (!provider) {
      throw new NotFoundException('Prestador no encontrado');
    }
    return provider;
  }

  async findAllProviders() {
    const providers = await this.providerRepository.findAll();
    if (!providers) {
      throw new NotFoundException('No hay prestadores');
    }
    return providers;
  }
}
