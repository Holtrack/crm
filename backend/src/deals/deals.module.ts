import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deal } from './deal.entity';
import { Company } from '../companies/company.entity';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Deal, Company])],
  controllers: [DealsController],
  providers: [DealsService],
  exports: [DealsService],
})
export class DealsModule {}
