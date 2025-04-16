import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Metadata } from 'src/shared/base-class/payload-base';

import { AccessRulesDomService } from '../../../domain/common/services/access-rules.dom.service';
import { SimpleAccessRulesDto } from '../dto/access-rules.dto';

@Injectable()
export class AccessService {
  constructor(private readonly accessRulesDomService: AccessRulesDomService) {}

  async findAccessRulesByRoleName(roleName: string, metadata: Metadata) {
    const accessRules = await this.accessRulesDomService.findAccessRulesByRoleName({ roleName, user: metadata.user });
    return plainToInstance(SimpleAccessRulesDto, accessRules.simpleAccessRules, { excludeExtraneousValues: true });
  }
}
