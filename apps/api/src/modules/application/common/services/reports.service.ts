import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ReportTypesDomService } from '../../../domain/common/services/report-types.dom.service';
import { ReportDto } from '../dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly reportsDomService: ReportTypesDomService) {}

  async findOneById(id: number) {
    const stageProcess = this.reportsDomService.findOneById(id);
    return plainToInstance(ReportDto, stageProcess, { excludeExtraneousValues: true });
  }

  async findList() {
    const entities = await this.reportsDomService.findList();
    return plainToInstance(ReportDto, entities, { strategy: 'excludeAll' });
  }
}
