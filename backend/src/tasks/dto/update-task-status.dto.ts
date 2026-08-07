import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { TASK_STATUSES, type TaskStatus } from '../task.entity';

export class UpdateTaskStatusDto {
  @ApiProperty({ enum: TASK_STATUSES })
  @IsIn(TASK_STATUSES)
  status: TaskStatus;
}
