import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ExpensesModule } from './expenses/expenses.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [PrismaModule, ExpensesModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
