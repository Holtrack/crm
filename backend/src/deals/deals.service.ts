import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from './deal.entity';
import { Company } from '../companies/company.entity';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { UpdateDealStatusDto } from './dto/update-deal-status.dto';
import { DealQueryDto } from './dto/deal-query.dto';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal)
    private readonly dealsRepository: Repository<Deal>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  findAll(query: DealQueryDto): Promise<Deal[]> {
    const where: Record<string, unknown> = {};
    if (query.companyId) where.companyId = query.companyId;

    return this.dealsRepository.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Deal> {
    const deal = await this.dealsRepository.findOne({ where: { id } });
    if (!deal) {
      throw new NotFoundException(`Deal not found: ${id}`);
    }
    return deal;
  }

  async create(dto: CreateDealDto): Promise<Deal> {
    const companyExists = await this.companiesRepository.exists({
      where: { id: dto.companyId },
    });
    if (!companyExists) {
      throw new NotFoundException(`Company not found: ${dto.companyId}`);
    }

    const deal = this.dealsRepository.create(dto);
    return this.dealsRepository.save(deal);
  }

  async update(id: string, dto: UpdateDealDto): Promise<Deal> {
    const deal = await this.findOne(id);
    Object.assign(deal, dto);
    return this.dealsRepository.save(deal);
  }

  async updateStatus(id: string, dto: UpdateDealStatusDto): Promise<Deal> {
    const deal = await this.findOne(id);
    deal.status = dto.status;
    return this.dealsRepository.save(deal);
  }

  async remove(id: string): Promise<void> {
    const deal = await this.findOne(id);
    await this.dealsRepository.remove(deal);
  }
}
