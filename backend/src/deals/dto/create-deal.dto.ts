import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { DEAL_STATUSES, type DealStatus } from '../deal.entity';

export class CreateDealDto {
  @ApiProperty()
  @IsUUID()
  companyId: string;

  @ApiProperty({ example: 'Annual Contract Renewal' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'Rp 50.000.000' })
  @IsString()
  @MinLength(1)
  amount: string;

  @ApiProperty({ enum: DEAL_STATUSES })
  @IsIn(DEAL_STATUSES)
  status: DealStatus;

  @ApiProperty({ minimum: 0, maximum: 100 })
  @IsInt()
  @Min(0)
  @Max(100)
  probability: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  contactId?: string;
}
