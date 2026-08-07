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

export class UpdateDealDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  amount?: string;

  @ApiProperty({ required: false, enum: DEAL_STATUSES })
  @IsOptional()
  @IsIn(DEAL_STATUSES)
  status?: DealStatus;

  @ApiProperty({ required: false, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  probability?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  contactId?: string;
}
