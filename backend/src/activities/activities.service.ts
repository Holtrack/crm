import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { Company } from '../companies/company.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ActivityQueryDto } from './dto/activity-query.dto';

export interface ActivityResponse extends Activity {
  datetime: string;
}

function formatDateTime(date: Date): string {
  const datePart = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const timePart = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
  return `${datePart}, ${timePart}`;
}

function toResponse(activity: Activity): ActivityResponse {
  return { ...activity, datetime: formatDateTime(activity.occurredAt) };
}

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activitiesRepository: Repository<Activity>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async findAll(query: ActivityQueryDto): Promise<ActivityResponse[]> {
    const where: Record<string, unknown> = {};
    if (query.companyId) where.companyId = query.companyId;

    const activities = await this.activitiesRepository.find({
      where,
      order: { occurredAt: 'DESC' },
    });
    return activities.map(toResponse);
  }

  async findOne(id: string): Promise<ActivityResponse> {
    const activity = await this.activitiesRepository.findOne({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`Activity not found: ${id}`);
    }
    return toResponse(activity);
  }

  private async getEntity(id: string): Promise<Activity> {
    const activity = await this.activitiesRepository.findOne({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`Activity not found: ${id}`);
    }
    return activity;
  }

  async create(dto: CreateActivityDto): Promise<ActivityResponse> {
    const companyExists = await this.companiesRepository.exists({
      where: { id: dto.companyId },
    });
    if (!companyExists) {
      throw new NotFoundException(`Company not found: ${dto.companyId}`);
    }

    const occurredAt = new Date(`${dto.date}T${dto.time}:00.000Z`);
    const activity = this.activitiesRepository.create({
      companyId: dto.companyId,
      title: dto.title,
      type: dto.type,
      occurredAt,
      summary: dto.summary,
    });
    const saved = await this.activitiesRepository.save(activity);
    return toResponse(saved);
  }

  async update(id: string, dto: UpdateActivityDto): Promise<ActivityResponse> {
    const activity = await this.getEntity(id);
    activity.title = dto.title;
    activity.type = dto.type;
    activity.occurredAt = new Date(dto.occurredAt);
    activity.summary = dto.summary;
    const saved = await this.activitiesRepository.save(activity);
    return toResponse(saved);
  }

  async remove(id: string): Promise<void> {
    const activity = await this.getEntity(id);
    await this.activitiesRepository.remove(activity);
  }
}
