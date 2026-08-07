import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class ActivityQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  companyId?: string;
}
