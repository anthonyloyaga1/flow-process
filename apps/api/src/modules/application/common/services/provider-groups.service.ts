import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ProviderGroupsDomService } from '../../../domain/common/services/provider-groups.dom.service';
import { ProviderGroupDto } from '../dto/provider-group.dto';

@Injectable()
export class ProviderGroupsService {
  constructor(private readonly grupoPrestadoresDomService: ProviderGroupsDomService) {}

  async findList() {
    const entities = await this.grupoPrestadoresDomService.findList();
    return plainToInstance(ProviderGroupDto, entities, { strategy: 'excludeAll' });
  }
}
