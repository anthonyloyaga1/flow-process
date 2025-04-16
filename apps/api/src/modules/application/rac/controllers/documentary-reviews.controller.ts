import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthenticatedUser, Resource, Scopes } from 'nest-keycloak-connect';

import { SwaggerResponses } from '../../../../shared/decorators/swagger-responses';
import { TokenInfo } from '../../../../shared/interfaces/token-info.interface';
import { DocumentaryReviewBasicDoc, DocumentaryReviewDoc } from '../docs/documentary-review.doc';
import { CreateDocumentaryReviewDto } from '../dto/create-documentary-review.dto';
import { UpdateDocumentaryReviewDto } from '../dto/update-documentary-review.dto';
import { DocumentaryReviewsService } from '../services/documentary-reviews.service';

@ApiBearerAuth()
@ApiTags('Documentary reviews (Revisión documental)')
@Controller('documentary-reviews')
@Resource('DocumentaryReviews')
export class DocumentaryReviewsController {
  constructor(private readonly documentaryReviewsService: DocumentaryReviewsService) {}

  @Post()
  @Scopes('create')
  @ApiOperation({ summary: 'Crear revisión documental' })
  @SwaggerResponses(DocumentaryReviewBasicDoc)
  create(@Body() body: CreateDocumentaryReviewDto, @AuthenticatedUser() user: TokenInfo) {
    return this.documentaryReviewsService.create(body, {
      user: user || { preferred_username: user?.preferred_username || '1724601234', name: 'admin create' },
    });
  }

  @Get(':id')
  @Scopes('read')
  @ApiOperation({ summary: 'Obtener revisión documental por id' })
  @SwaggerResponses(DocumentaryReviewDoc)
  findOneById(@Param('id') id: string) {
    return this.documentaryReviewsService.findOneById(+id);
  }

  @Get('processId/:processId')
  @Scopes('read')
  @ApiOperation({ summary: 'Obtener revisión documental por Id del trámite' })
  @SwaggerResponses(DocumentaryReviewDoc)
  findOneByProcessId(@Param('processId') processId: string) {
    return this.documentaryReviewsService.findOneByProcessId(+processId);
  }

  @Put(':id')
  @Scopes('update')
  @ApiOperation({ summary: 'Actualizar revisión documental' })
  @SwaggerResponses(DocumentaryReviewBasicDoc)
  update(@Param('id') id: string, @Body() body: UpdateDocumentaryReviewDto, @AuthenticatedUser() user: TokenInfo) {
    return this.documentaryReviewsService.update(+id, body, {
      user: user || { preferred_username: user?.preferred_username || '1724601234', name: 'admin update' },
    });
  }
}
