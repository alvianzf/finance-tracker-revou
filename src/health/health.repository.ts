import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async checkDatabase() {
    const start = Date.now();

    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'healthy',
        responseTime: Date.now() - start,
      };
    } catch {
      return {
        status: 'unhealthy',
        responseTime: Date.now() - start,
      };
    }
  }

  checkMemory() {
    const { heapUsed, heapTotal } = process.memoryUsage();
    const usagePercent = Math.round((heapUsed / heapTotal) * 100);

    return {
      status: usagePercent < 85 ? 'healthy' : 'degraded',
      usagePercent,
    };
  }
}
