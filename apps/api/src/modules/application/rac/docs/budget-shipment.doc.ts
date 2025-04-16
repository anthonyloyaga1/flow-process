import { ApiProperty } from '@nestjs/swagger';

import { SuccessDoc } from '../../../../shared/base-class/doc-base';
import { BudgetShipmentBasicDto, BudgetShipmentDto } from '../dto/budget-shipment.dto';

export class BudgetShipmentBasicDoc extends SuccessDoc {
  @ApiProperty({ type: BudgetShipmentBasicDto, description: 'Datos de trámite' })
  data: BudgetShipmentBasicDto;
}

export class BudgetShipmentDoc extends SuccessDoc {
  @ApiProperty({ type: BudgetShipmentDto, description: 'Datos de trámite' })
  data: BudgetShipmentDto;
}

export class BudgetShipmentListDoc extends SuccessDoc {
  @ApiProperty({ type: [BudgetShipmentDto], description: 'Datos de trámite' })
  data: BudgetShipmentDto[];
}
