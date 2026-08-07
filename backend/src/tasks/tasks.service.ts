import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, type TaskPriority } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { CreateFollowUpTaskDto } from './dto/create-follow-up-task.dto';

const DAY_MS = 24 * 60 * 60 * 1000;
const FOLLOW_UP_DUE_DAYS = 14;

function daysSince(date: Date, now: Date): number {
  return Math.floor((now.getTime() - date.getTime()) / DAY_MS);
}

export interface TaskResponse extends Task {
  effectivePriority: TaskPriority;
}

function toResponse(task: Task, now: Date = new Date()): TaskResponse {
  let effectivePriority = task.priority;
  if (task.isFollowUp && task.status !== 'Completed') {
    const elapsed = daysSince(task.createdAt, now);
    if (elapsed >= FOLLOW_UP_DUE_DAYS) effectivePriority = 'High';
    else if (elapsed >= 7) effectivePriority = 'Medium';
  }
  return { ...task, effectivePriority };
}

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async findAll(query: TaskQueryDto): Promise<TaskResponse[]> {
    const where: Record<string, unknown> = {};
    if (query.companyId) where.companyId = query.companyId;
    if (query.status) where.status = query.status;

    const tasks = await this.tasksRepository.find({
      where,
      order: { dueDate: 'ASC' },
    });
    return tasks.map((task) => toResponse(task));
  }

  async findOne(id: string): Promise<TaskResponse> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task not found: ${id}`);
    }
    return toResponse(task);
  }

  private async getEntity(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task not found: ${id}`);
    }
    return task;
  }

  async create(dto: CreateTaskDto): Promise<TaskResponse> {
    const task = this.tasksRepository.create(dto);
    const saved = await this.tasksRepository.save(task);
    return toResponse(saved);
  }

  async createFollowUp(dto: CreateFollowUpTaskDto): Promise<TaskResponse> {
    const now = new Date();
    const due = new Date(now);
    due.setDate(due.getDate() + FOLLOW_UP_DUE_DAYS);

    const task = this.tasksRepository.create({
      title: `Follow Up ${dto.companyName}`,
      tag: dto.companyStatus,
      status: 'Todo',
      priority: 'Low',
      dueDate: toDateOnly(due),
      companyId: dto.companyId,
      isFollowUp: true,
    });
    const saved = await this.tasksRepository.save(task);
    return toResponse(saved);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<TaskResponse> {
    const task = await this.getEntity(id);
    task.dueDate = dto.dueDate;
    task.priority = dto.priority;
    task.notes = dto.notes ?? '';
    const saved = await this.tasksRepository.save(task);
    return toResponse(saved);
  }

  async updateStatus(
    id: string,
    dto: UpdateTaskStatusDto,
  ): Promise<TaskResponse> {
    const task = await this.getEntity(id);
    task.status = dto.status;
    const saved = await this.tasksRepository.save(task);
    return toResponse(saved);
  }

  async remove(id: string): Promise<void> {
    const task = await this.getEntity(id);
    await this.tasksRepository.remove(task);
  }
}
