import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';
import { TASK_PRIORITIES, type TaskPriority } from '../task.entity';

export class UpdateTaskDto {
  @ApiProperty({ example: '2026-08-20' })
  @IsDateString({ strict: true })
  dueDate: string;

  @ApiProperty({ enum: TASK_PRIORITIES })
  @IsIn(TASK_PRIORITIES)
  priority: TaskPriority;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
