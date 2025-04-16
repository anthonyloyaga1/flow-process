import { HttpException, Injectable } from '@nestjs/common';

import { ErrorMessage } from '../../../../shared/constants/error-messages';
import { ReportTypesRepository } from '../../../infraestructure/database/repositories/report-types.repository';
import { ReportType } from '../models/report-type';

@Injectable()
export class ReportTypesDomService {
  constructor(private readonly reportTypesRepository: ReportTypesRepository) {}

  async findOneById(id: number) {
    const reportType = await this.reportTypesRepository.findOneBasicById(id);
    this.checkReportExist(reportType);

    return reportType;
  }

  async findList() {
    const reportTypes = await this.reportTypesRepository.findList();
    this.checkReportsExist(reportTypes);

    return reportTypes;
  }

  private checkReportsExist(reportTypes: ReportType[]) {
    if (!reportTypes) throw new HttpException(ErrorMessage.PROCESS_REPORT_TYPE_NOT_FOUND.MSG, ErrorMessage.PROCESS_REPORT_TYPE_NOT_FOUND.CODE);
  }

  private checkReportExist(reportType: ReportType) {
    if (!reportType) throw new HttpException(ErrorMessage.PROCESS_REPORT_TYPE_NOT_FOUND.MSG, ErrorMessage.PROCESS_REPORT_TYPE_NOT_FOUND.CODE);
  }
}
