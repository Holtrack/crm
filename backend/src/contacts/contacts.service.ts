import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Contact } from './contact.entity';
import { Company } from '../companies/company.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactQueryDto } from './dto/contact-query.dto';

export interface ContactResponse extends Contact {
  companyName: string;
  title: string;
}

function toResponse(contact: Contact): ContactResponse {
  return {
    ...contact,
    companyName: contact.company?.name ?? '',
    title: contact.position
      ? `${contact.position} at ${contact.company?.name ?? ''}`
      : '',
  };
}

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactsRepository: Repository<Contact>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async findAll(query: ContactQueryDto): Promise<ContactResponse[]> {
    const where: Record<string, unknown> = {};
    if (query.search) where.name = ILike(`%${query.search}%`);
    if (query.companyId) where.companyId = query.companyId;

    const contacts = await this.contactsRepository.find({
      where,
      relations: { company: true },
      order: { createdAt: 'DESC' },
    });
    return contacts.map(toResponse);
  }

  async findOne(id: string): Promise<ContactResponse> {
    const contact = await this.contactsRepository.findOne({
      where: { id },
      relations: { company: true },
    });
    if (!contact) {
      throw new NotFoundException(`Contact not found: ${id}`);
    }
    return toResponse(contact);
  }

  private async assertCompanyExists(companyId: string) {
    const exists = await this.companiesRepository.exists({
      where: { id: companyId },
    });
    if (!exists) {
      throw new NotFoundException(`Company not found: ${companyId}`);
    }
  }

  async create(dto: CreateContactDto): Promise<ContactResponse> {
    await this.assertCompanyExists(dto.companyId);

    const contact = this.contactsRepository.create({
      name: dto.name,
      companyId: dto.companyId,
      email: dto.email ?? '',
      phone: dto.phone ?? '',
      position: dto.position ?? '',
      owner: dto.owner,
      notes: dto.notes ?? '',
    });
    const saved = await this.contactsRepository.save(contact);
    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateContactDto): Promise<ContactResponse> {
    const contact = await this.contactsRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact not found: ${id}`);
    }
    if (dto.companyId) {
      await this.assertCompanyExists(dto.companyId);
    }

    Object.assign(contact, dto);
    await this.contactsRepository.save(contact);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const contact = await this.contactsRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact not found: ${id}`);
    }
    await this.contactsRepository.remove(contact);
  }
}
