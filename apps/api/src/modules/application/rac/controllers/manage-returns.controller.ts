import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, Resource, Scopes } from 'nest-keycloak-connect';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { TokenInfo } from '../../../../shared/interfaces/token-info.interface';
import { ManageReturnsService } from '../services/manage-returns.service';
import { ProcessBasicDoc } from '../docs/process.doc';
import { UpdateManageReturnToPreviousStageDto } from '../dto/update-manage-return.dto';

@ApiBearerAuth()
@ApiTags('Managing Return (Gestión de solicitudes de retorno)')
@Controller('managing-return')
@Resource('ManageReturns')
export class ManageReturnsController {
  constructor(private readonly managingReturnService: ManageReturnsService) {}

  @Patch('processId/:processId')
  @Scopes('update')
  @ApiOperation({ summary: 'Gestionar la aprobación o rechazo del trámite a retornar' })
  @SwaggerResponses(ProcessBasicDoc)
  manageReturnToPreviousStage(
    @Param('processId') processId: string,
    @Body() body: UpdateManageReturnToPreviousStageDto,
    @AuthenticatedUser() user: TokenInfo,
  ) {
    return this.managingReturnService.manageReturnToPreviousStage(+processId, body, {
      user: user || { preferred_username: user?.preferred_username || '1724601234', name: 'admin approve' },
    });
  }
}
