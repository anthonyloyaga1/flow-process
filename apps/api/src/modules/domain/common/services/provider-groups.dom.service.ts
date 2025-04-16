import { HttpException, Injectable } from '@nestjs/common';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { ProviderGroupsRepository } from '../../../infraestructure/database/repositories/provider-groups.repository';

@Injectable()
export class ProviderGroupsDomService {
  constructor(private readonly providerGroup: ProviderGroupsRepository) {}

  async findList() {
    const providerGroups = await this.providerGroup.findList();
    if (!providerGroups) throw new HttpException(ErrorMessage.PROVIDER_NOT_FOUND.MSG, ErrorMessage.PROVIDER_NOT_FOUND.CODE);
    return providerGroups;
  }
}
