import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateCompanyStatusDto } from './dto/update-company-status.dto';
import { UpdateCompanyCredentialsDto } from './dto/update-company-credentials.dto';
import { CompanyQueryDto } from './dto/company-query.dto';

export interface CompanyResponse extends Company {
  tagline: string;
  location: string;
}

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toResponse(company: Company): CompanyResponse {
  return {
    ...company,
    tagline: `${company.industry} Partner`,
    location: `${company.region}, ID`,
  };
}

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async findAll(query: CompanyQueryDto): Promise<CompanyResponse[]> {
    const where: Record<string, unknown> = {};
    if (query.search) where.name = ILike(`%${query.search}%`);
    if (query.status) where.status = query.status;
    if (query.owner) where.teamLeadOwner = query.owner;

    const companies = await this.companiesRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
    return companies.map(toResponse);
  }

  async findOne(id: string): Promise<CompanyResponse> {
    const company = await this.companiesRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company not found: ${id}`);
    }
    return toResponse(company);
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const base = slugify(name);
    let slug = base;
    let suffix = 2;
    while (await this.companiesRepository.exists({ where: { slug } })) {
      slug = `${base}-${suffix}`;
      suffix += 1;
    }
    return slug;
  }

  async create(dto: CreateCompanyDto): Promise<CompanyResponse> {
    const slug = await this.generateUniqueSlug(dto.name);
    const company = this.companiesRepository.create({
      slug,
      name: dto.name,
      industry: dto.industry,
      region: dto.region,
      website: dto.website ?? '',
      phone: dto.phone ?? '',
      address: dto.address ?? '',
      teamLeadOwner: dto.teamLeadOwner,
      status: dto.status,
      source: dto.source,
    });
    const saved = await this.companiesRepository.save(company);
    return toResponse(saved);
  }

  private async getEntity(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company not found: ${id}`);
    }
    return company;
  }

  async update(id: string, dto: UpdateCompanyDto): Promise<CompanyResponse> {
    const company = await this.getEntity(id);
    Object.assign(company, dto);
    const saved = await this.companiesRepository.save(company);
    return toResponse(saved);
  }

  async updateStatus(
    id: string,
    dto: UpdateCompanyStatusDto,
  ): Promise<CompanyResponse> {
    const company = await this.getEntity(id);
    company.status = dto.status;
    const saved = await this.companiesRepository.save(company);
    return toResponse(saved);
  }

  async updateCredentials(
    id: string,
    dto: UpdateCompanyCredentialsDto,
  ): Promise<CompanyResponse> {
    const company = await this.getEntity(id);
    company.industry = dto.industry;
    company.website = dto.website ?? '';
    company.phone = dto.phone ?? '';
    company.address = dto.address ?? '';
    company.teamLeadOwner = dto.teamLeadOwner;
    company.source = dto.source;
    const saved = await this.companiesRepository.save(company);
    return toResponse(saved);
  }

  async remove(id: string): Promise<void> {
    const company = await this.getEntity(id);
    await this.companiesRepository.remove(company);
  }
}
