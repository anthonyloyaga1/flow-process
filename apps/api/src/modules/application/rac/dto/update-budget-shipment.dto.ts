import { PartialType } from '@nestjs/swagger';
import { CreateBudgetShipmentDto } from './create-budget-shipment.dto';

export class UpdateBudgetShipmentDto extends PartialType(CreateBudgetShipmentDto) {}
