import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExpensesRepository } from './expenses.repository';

@Module({
  controllers: [ExpensesController],
  providers: [ExpensesService, ExpensesRepository, PrismaService],
})
export class ExpensesModule {}
