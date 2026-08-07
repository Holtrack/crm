import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { COMPANY_SOURCES, type CompanySource } from '../company.entity';

export class UpdateCompanyCredentialsDto {
  @ApiProperty({ example: 'Manufacturing & Tech' })
  @IsString()
  @MinLength(2)
  industry: string;

  @ApiProperty({ required: false, example: 'www.contoh.co.id' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ required: false, example: '021xxxxxxx' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, example: 'Street, building, city' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Charissa' })
  @IsString()
  @MinLength(1)
  teamLeadOwner: string;

  @ApiProperty({ enum: COMPANY_SOURCES })
  @IsIn(COMPANY_SOURCES)
  source: CompanySource;
}
