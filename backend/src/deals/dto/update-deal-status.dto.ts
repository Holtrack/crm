import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { DEAL_STATUSES, type DealStatus } from '../deal.entity';

export class UpdateDealStatusDto {
  @ApiProperty({ enum: DEAL_STATUSES })
  @IsIn(DEAL_STATUSES)
  status: DealStatus;
}
