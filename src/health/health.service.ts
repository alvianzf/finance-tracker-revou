import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async check() {
    const timestamp = new Date().toISOString();
    const uptime = Math.floor(process.uptime());
    const environment = process.env.NODE_ENV ?? 'development';
    const version = process.env.APP_VERSION ?? '1.0.0';

    // DATABASE CHECK
    const dbStart = Date.now();
    let databaseStatus = 'healthy';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      databaseStatus = 'unhealthy';
    }

    const dbResponseTime = Date.now() - dbStart;

    // MEMORY CHECK
    const memoryUsage = process.memoryUsage();
    const used = memoryUsage.heapUsed;
    const total = memoryUsage.heapTotal;
    const usagePercent = Math.round((used / total) * 100);

    const memoryStatus = usagePercent < 85 ? 'healthy' : 'degraded';

    // OVERALL STATUS
    const status =
      databaseStatus === 'healthy' && memoryStatus === 'healthy'
        ? 'healthy'
        : 'degraded';

    return {
      status,
      timestamp,
      uptime,
      environment,
      version,
      checks: {
        database: {
          status: databaseStatus,
          responseTime: dbResponseTime,
        },
        memory: {
          status: memoryStatus,
          usagePercent,
        },
      },
    };
  }
}
