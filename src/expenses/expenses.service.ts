import { Injectable, NotFoundException } from '@nestjs/common';
import { ExpensesRepository } from './expenses.repository';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly repo: ExpensesRepository) {}

  async create(dto: CreateExpenseDto) {
    const [user, category] = await Promise.all([
      this.repo.findUserById(dto.userId),
      this.repo.findCategoryById(dto.categoryId),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.repo.createExpense(dto);
  }

  findByUser(userId: number) {
    return this.repo.findExpensesByUser(userId);
  }
}
