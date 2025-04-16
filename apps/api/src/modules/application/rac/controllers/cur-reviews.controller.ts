import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, Resource, Scopes } from 'nest-keycloak-connect';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { TokenInfo } from '../../../../shared/interfaces/token-info.interface';
import { CurReviewBasicDoc, CurReviewDoc } from '../docs/cur-review.doc';
import { CreateCurReviewDto } from '../dto/create-cur-review.dto';
import { UpdateCurReviewDto } from '../dto/update-cur-review.dto';
import { CurReviewsService } from '../services/cur-reviews.service';

@ApiBearerAuth()
@ApiTags('Cur reviews (CUR por disparar)')
@Controller('cur-reviews')
@Resource('CurReviews')
export class CurReviewsController {
  constructor(private readonly curReviewService: CurReviewsService) {}

  @Post()
  @Scopes('create')
  @ApiOperation({ summary: 'Crear revisión documental' })
  @SwaggerResponses(CurReviewBasicDoc)
  create(@Body() body: CreateCurReviewDto, @AuthenticatedUser() user: TokenInfo) {
    return this.curReviewService.create(body, {
      user: user || { preferred_username: user?.preferred_username || '1724601234', name: 'admin create' },
    });
  }

  @Get(':id')
  @Scopes('read')
  @ApiOperation({ summary: 'Obtener revisión documental por id' })
  @SwaggerResponses(CurReviewDoc)
  findOneById(@Param('id') id: string) {
    return this.curReviewService.findOneById(+id);
  }

  @Get('processId/:processId')
  @Scopes('read')
  @ApiOperation({ summary: 'Obtener revisión documental por Id del trámite' })
  @SwaggerResponses(CurReviewDoc)
  findOneByProcessId(@Param('processId') processId: string) {
    return this.curReviewService.findOneByProcessId(+processId);
  }

  @Put(':id')
  @Scopes('update')
  @ApiOperation({ summary: 'Actualizar revisión documental' })
  @SwaggerResponses(CurReviewBasicDoc)
  update(@Param('id') id: string, @Body() body: UpdateCurReviewDto, @AuthenticatedUser() user: TokenInfo) {
    return this.curReviewService.update(+id, body, {
      user: user || { preferred_username: user?.preferred_username || '1724601234', name: 'admin update' },
    });
  }
}
