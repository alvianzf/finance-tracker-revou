import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  findCategoryById(categoryId: number) {
    return this.prisma.category.findUnique({
      where: { id: categoryId },
    });
  }

  createExpense(dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        userId: dto.userId,
        categoryId: dto.categoryId,
        amount: dto.amount,
        description: dto.description,
        expenseDate: new Date(dto.expenseDate),
      },
    });
  }

  findExpensesByUser(userId: number) {
    return this.prisma.expense.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { expenseDate: 'desc' },
    });
  }
}
