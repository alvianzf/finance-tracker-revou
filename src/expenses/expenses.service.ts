import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateExpenseDto) {
    const [user, category] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: dto.userId } }),
      this.prisma.category.findUnique({ where: { id: dto.categoryId } }),
    ]);

    if (!user) throw new NotFoundException('User not found');
    if (!category) throw new NotFoundException('Category not found');

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

  findByUser(userId: number) {
    return this.prisma.expense.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { expenseDate: 'desc' },
    });
  }
}
