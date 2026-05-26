import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTodoDto: CreateTodoDto) {
    return this.prisma.todo.create({
      data: {
        text: createTodoDto.text,
        categoryId: createTodoDto.categoryId,
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
    });
  }

  async findOne(id: number) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return todo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return this.prisma.todo.update({
      where: { id },
      data: updateTodoDto,
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
}
