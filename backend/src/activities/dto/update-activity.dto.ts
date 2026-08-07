import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsString, MinLength } from 'class-validator';
import { ACTIVITY_TYPES, type ActivityType } from '../activity.entity';

export class UpdateActivityDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ enum: ACTIVITY_TYPES })
  @IsIn(ACTIVITY_TYPES)
  type: ActivityType;

  @ApiProperty({
    description: 'ISO 8601 datetime',
    example: '2026-08-06T14:30:00.000Z',
  })
  @IsDateString()
  occurredAt: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  summary: string;
}
