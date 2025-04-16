import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { Metadata } from '../../../../shared/base-class/payload-base';
import { getUserInitials } from '../../../../shared/helpers/user-initials';
import { DocumentaryReview } from '../../../domain/rac/models/documentary-review';
import { DocumentaryReviewsDomService } from '../../../domain/rac/services/documentary-reviews.dom.service';
import { CreateDocumentaryReviewDto } from '../dto/create-documentary-review.dto';
import { DocumentaryReviewBasicDto, DocumentaryReviewDto } from '../dto/documentary-review.dto';
import { UpdateDocumentaryReviewDto } from '../dto/update-documentary-review.dto';

@Injectable()
export class DocumentaryReviewsService {
  constructor(private readonly documentaryReviewsDomService: DocumentaryReviewsDomService) {}

  /**
   * Crear revisión documental
   * @description CU_003_FLUJO_NORMAL Revisión documental
   *
   * @async
   * @param {CreateDocumentaryReviewDto} body
   * @param {Metadata} metadata
   * @returns {Promise<DocumentaryReviewBasicDto>}
   */
  async create(body: CreateDocumentaryReviewDto, metadata: Metadata): Promise<DocumentaryReviewBasicDto> {
    const documentaryReview = plainToInstance(DocumentaryReview, body);

    //* Ref CU02_RN01 Iniciales del usuario que crea el proceso
    documentaryReview.createdBy = metadata.user.preferred_username;
    documentaryReview.createdByInitials = getUserInitials(metadata.user.name);
    documentaryReview.createdByName = metadata.user.name;
    if (documentaryReview.process) {
      documentaryReview.process.returnStageBy = metadata.user.preferred_username;
      documentaryReview.process.returnStageByName = metadata.user.name;
    }

    const documentaryReviewSaved = this.documentaryReviewsDomService.create(documentaryReview);
    return plainToInstance(DocumentaryReviewBasicDto, documentaryReviewSaved, { excludeExtraneousValues: true });
  }

  /**
   * Obtener revisión documental por id
   * @description CU_003_FLUJO_NORMAL Revisión documental
   *
   * @async
   * @param {number} id
   * @returns {Promise<DocumentaryReviewDto>}
   */
  async findOneById(id: number): Promise<DocumentaryReviewDto> {
    const documentaryReview = await this.documentaryReviewsDomService.findOneById(id);
    return plainToInstance(DocumentaryReviewDto, documentaryReview, { excludeExtraneousValues: true });
  }

  async findOneByProcessId(processId: number): Promise<DocumentaryReviewDto> {
    const documentaryReview = await this.documentaryReviewsDomService.findOneByProcessId(processId);
    return plainToInstance(DocumentaryReviewDto, documentaryReview, { excludeExtraneousValues: true });
  }

  /**
   * Actualizar revisión documental
   * @description CU_003_FLUJO_NORMAL Revisión documental
   *
   * @async
   * @param {number} id
   * @param {UpdateDocumentaryReviewDto} body
   * @param {Metadata} metadata
   * @returns {Promise<DocumentaryReviewBasicDto>}
   */
  async update(id: number, body: UpdateDocumentaryReviewDto, metadata: Metadata): Promise<DocumentaryReviewBasicDto> {
    const documentaryReview = plainToInstance(DocumentaryReview, { ...body, id });
    documentaryReview.modifiedBy = metadata.user.preferred_username;

    if (documentaryReview.process) {
      documentaryReview.process.returnStageBy = metadata.user.preferred_username;
      documentaryReview.process.returnStageByName = metadata.user.name;
    }

    const documentaryReviewEdited = this.documentaryReviewsDomService.update(documentaryReview);

    return plainToInstance(DocumentaryReviewBasicDto, documentaryReviewEdited, { excludeExtraneousValues: true });
  }
}
