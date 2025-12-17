import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HealthRepository } from './health.repository';

@Module({
  controllers: [HealthController],
  providers: [HealthService, PrismaService, HealthRepository],
})
export class HealthModule {}
