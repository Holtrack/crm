import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { COMPANY_STATUSES, type CompanyStatus } from '../company.entity';

export class CompanyQueryDto {
  @ApiPropertyOptional({
    description: 'Case-insensitive substring match on name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: COMPANY_STATUSES })
  @IsOptional()
  @IsIn(COMPANY_STATUSES)
  status?: CompanyStatus;

  @ApiPropertyOptional({ description: 'Exact match on teamLeadOwner' })
  @IsOptional()
  @IsString()
  owner?: string;
}
