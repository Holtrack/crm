import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { COMPANY_STATUSES, type CompanyStatus } from '../company.entity';

export class UpdateCompanyStatusDto {
  @ApiProperty({ enum: COMPANY_STATUSES })
  @IsIn(COMPANY_STATUSES)
  status: CompanyStatus;
}
