import { Injectable } from '@nestjs/common';

import { ProviderFinder } from '../services/provider-finder.service';

@Injectable()
export class FindAllProvidersUseCase {
  constructor(private readonly providerFinder: ProviderFinder) {}

  async execute() {
    const providers = await this.providerFinder.findAllProviders();
    return providers.map((provider) => provider.toPrimitives());
  }
}
