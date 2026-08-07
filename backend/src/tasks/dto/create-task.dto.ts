import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsOptional,
  IsUUID,
  IsString,
  MinLength,
} from 'class-validator';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskPriority,
  type TaskStatus,
} from '../task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Follow Up PT ABC' })
  @IsString()
  @MinLength(2)
  title: string;

  @ApiProperty({ example: 'Lead' })
  @IsString()
  @MinLength(1)
  tag: string;

  @ApiProperty({ enum: TASK_STATUSES })
  @IsIn(TASK_STATUSES)
  status: TaskStatus;

  @ApiProperty({ enum: TASK_PRIORITIES })
  @IsIn(TASK_PRIORITIES)
  priority: TaskPriority;

  @ApiProperty({ example: '2026-08-20' })
  @IsDateString({ strict: true })
  dueDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  companyId?: string;
}
