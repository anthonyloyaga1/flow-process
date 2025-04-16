import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, Scopes } from 'nest-keycloak-connect';
import { TokenInfo } from 'src/shared/interfaces/token-info.interface';

import { AccessService } from '../services/access-rules..service';

@ApiBearerAuth()
@ApiTags('Common (recursos comunes)')
@Controller('common/authz')
export class AccessController {
  constructor(private readonly authzService: AccessService) {}

  @Scopes()
  @Get('role/:roleName')
  findAccessRulesByRoleName(@Param('roleName') roleName: string, @AuthenticatedUser() user: TokenInfo) {
    return this.authzService.findAccessRulesByRoleName(roleName, { user });
  }
}
