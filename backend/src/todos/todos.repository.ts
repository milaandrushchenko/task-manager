import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiListResponse } from 'src/common/types/api-response.type';
import { Todo } from 'src/generated/prisma/client';

@Injectable()
export class TodosRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateTodoDto) {
    return this.prisma.todo.create({
      data: {
        text: data.text,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  async findAll(categoryId?: number): Promise<ApiListResponse<Todo>> {
    const todos = await this.prisma.todo.findMany({
      where: categoryId ? { categoryId } : {},
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      list: todos,
    };
  }

  findOne(id: number) {
    return this.prisma.todo.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  update(id: number, data: UpdateTodoDto) {
    return this.prisma.todo.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.todo.delete({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  countByCategoryId(categoryId: number): Promise<number> {
    return this.prisma.todo.count({
      where: {
        categoryId,
      },
    });
  }

  async updateStatusBulk(ids: number[], completed: boolean): Promise<number> {
    const result = await this.prisma.todo.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        completed,
      },
    });

    return result.count;
  }
}
