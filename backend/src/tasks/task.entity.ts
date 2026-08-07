import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export const TASK_STATUSES = ['Todo', 'In Progress', 'Completed'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ['Low', 'Medium', 'High'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  tag: string;

  @Column({ type: 'enum', enum: TASK_STATUSES, default: 'Todo' })
  status: TaskStatus;

  @Column({ type: 'enum', enum: TASK_PRIORITIES, default: 'Medium' })
  priority: TaskPriority;

  @Column({ type: 'date' })
  dueDate: string;

  @Column({ default: '' })
  notes: string;

  @Column({ nullable: true })
  companyId?: string;

  @Column({ default: false })
  isFollowUp: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
