import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, IsUUID, Matches, MinLength } from 'class-validator';
import { ACTIVITY_TYPES, type ActivityType } from '../activity.entity';

export class CreateActivityDto {
  @ApiProperty()
  @IsUUID()
  companyId: string;

  @ApiProperty({ example: 'Follow-up and Proposal Review Meeting' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ enum: ACTIVITY_TYPES })
  @IsIn(ACTIVITY_TYPES)
  type: ActivityType;

  @ApiProperty({ example: '2026-08-06' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  date: string;

  @ApiProperty({ example: '14:30' })
  @Matches(/^\d{2}:\d{2}$/, { message: 'time must be in HH:mm format' })
  time: string;

  @ApiProperty({ example: 'Discussed proposal terms and next steps.' })
  @IsString()
  @MinLength(5)
  summary: string;
}
