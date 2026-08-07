import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateCompanyStatusDto } from './dto/update-company-status.dto';
import { UpdateCompanyCredentialsDto } from './dto/update-company-credentials.dto';
import { CompanyQueryDto } from './dto/company-query.dto';

@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  findAll(@Query() query: CompanyQueryDto) {
    return this.companiesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCompanyDto) {
    return this.companiesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    return this.companiesService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateCompanyStatusDto) {
    return this.companiesService.updateStatus(id, dto);
  }

  @Patch(':id/credentials')
  updateCredentials(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyCredentialsDto,
  ) {
    return this.companiesService.updateCredentials(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.companiesService.remove(id);
  }
}
