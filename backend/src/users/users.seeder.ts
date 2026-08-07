import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersSeeder implements OnModuleInit {
  private readonly logger = new Logger(UsersSeeder.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    const email = this.config.get<string>('ADMIN_EMAIL', 'admin@holtrack.com');
    const password = this.config.get<string>('ADMIN_PASSWORD', 'holtrack2026');
    const name = this.config.get<string>('ADMIN_NAME', 'Charissa');

    const existing = await this.usersService.findByEmail(email);
    if (existing) return;

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await this.usersService.create({ email, passwordHash, name });
    this.logger.log(`Seeded default admin user (${email})`);
  }
}
