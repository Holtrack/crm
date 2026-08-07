import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ContactQueryDto {
  @ApiPropertyOptional({
    description: 'Case-insensitive substring match on name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  companyId?: string;
}
