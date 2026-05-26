import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';

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

  findAll() {
    return this.prisma.todo.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
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

  async countByCategoryId(categoryId: number): Promise<number> {
    return this.prisma.todo.count({
      where: {
        categoryId,
      },
    });
  }
}
