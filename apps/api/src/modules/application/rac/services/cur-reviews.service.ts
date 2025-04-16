import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CurReview } from 'src/modules/domain/rac/models/cur-review';
import { CurReviewsDomService } from 'src/modules/domain/rac/services/cur-reviews.dom.service';
import { Metadata } from 'src/shared/base-class/payload-base';
import { getUserInitials } from 'src/shared/helpers/user-initials';

import { CreateCurReviewDto } from '../dto/create-cur-review.dto';
import { CurReviewBasicDto, CurReviewDto } from '../dto/cur-review.dto';
import { UpdateCurReviewDto } from '../dto/update-cur-review.dto';

@Injectable()
export class CurReviewsService {
  constructor(private readonly curReviewsDomService: CurReviewsDomService) {}

  /**
   * Crear revisión documental
   * @description CU_003_FLUJO_NORMAL Revisión documental
   *
   * @async
   * @param {CreateCurReviewDto} body
   * @param {Metadata} metadata
   * @returns {Promise<CurReviewBasicDto>}
   */
  async create(body: CreateCurReviewDto, metadata: Metadata): Promise<CurReviewBasicDto> {
    const curReview = plainToInstance(CurReview, body);

    //* Ref CU02_RN01 Iniciales del usuario que crea el proceso
    curReview.createdBy = metadata.user.preferred_username;
    curReview.createdByInitials = getUserInitials(metadata.user.name);
    curReview.createdByName = metadata.user.name;

    const curReviewSaved = this.curReviewsDomService.create(curReview);
    return plainToInstance(CurReviewBasicDto, curReviewSaved, { excludeExtraneousValues: true });
  }

  /**
   * Obtener revisión documental por id
   * @description CU_003_FLUJO_NORMAL Revisión documental
   *
   * @async
   * @param {number} id
   * @returns {Promise<CurReviewDto>}
   */
  async findOneById(id: number): Promise<CurReviewDto> {
    const curReview = await this.curReviewsDomService.findOneById(id);
    return plainToInstance(CurReviewDto, curReview, { excludeExtraneousValues: true });
  }

  async findOneByProcessId(processId: number): Promise<CurReviewDto> {
    const curReview = await this.curReviewsDomService.findOneByProcessId(processId);
    return plainToInstance(CurReviewDto, curReview, { excludeExtraneousValues: true });
  }

  /**
   * Actualizar revisión documental
   * @description CU_003_FLUJO_NORMAL Revisión documental
   *
   * @async
   * @param {number} id
   * @param {UpdateCurReviewDto} body
   * @param {Metadata} metadata
   * @returns {Promise<CurReviewBasicDto>}
   */
  async update(id: number, body: UpdateCurReviewDto, metadata: Metadata): Promise<CurReviewBasicDto> {
    const curReview = plainToInstance(CurReview, { ...body, id });
    curReview.modifiedBy = metadata.user.preferred_username;

    const curReviewEdited = this.curReviewsDomService.update(curReview);

    return plainToInstance(CurReviewBasicDto, curReviewEdited, { excludeExtraneousValues: true });
  }
}
