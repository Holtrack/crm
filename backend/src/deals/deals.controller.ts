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
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { UpdateDealStatusDto } from './dto/update-deal-status.dto';
import { DealQueryDto } from './dto/deal-query.dto';

@ApiTags('deals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get()
  findAll(@Query() query: DealQueryDto) {
    return this.dealsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dealsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDealDto) {
    return this.dealsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDealDto) {
    return this.dealsService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateDealStatusDto) {
    return this.dealsService.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.dealsService.remove(id);
  }
}
