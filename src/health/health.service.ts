import { Injectable } from '@nestjs/common';
import { HealthRepository } from './health.repository';

@Injectable()
export class HealthService {
  constructor(private readonly repo: HealthRepository) {}

  async check() {
    const timestamp = new Date().toISOString();

    const uptime = Math.floor(process.uptime());
    const environment = process.env.NODE_ENV ?? 'development';
    const version = process.env.APP_VERSION ?? '1.0.0';

    const database = await this.repo.checkDatabase();
    const memory = this.repo.checkMemory();

    const status =
      database.status === 'healthy' && memory.status === 'healthy'
        ? 'healthy'
        : 'degraded';

    return {
      status,
      timestamp,
      uptime,
      environment,
      version,
      checks: {
        database,
        memory,
      },
    };
  }
}
