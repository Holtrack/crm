import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateFollowUpTaskDto {
  @ApiProperty()
  @IsUUID()
  companyId: string;

  @ApiProperty({ example: 'PT Contoh Sejahtera' })
  @IsString()
  @MinLength(1)
  companyName: string;

  @ApiProperty({ example: 'Prospect' })
  @IsString()
  @MinLength(1)
  companyStatus: string;
}
