import { Injectable, NotFoundException } from '@nestjs/common';
import { TodosRepository } from './todos.repository';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class TodosService {
  constructor(
    private readonly todosRepository: TodosRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    await this.categoriesService.findOne(createTodoDto.categoryId);
    return this.todosRepository.create(createTodoDto);
  }

  findAll() {
    return this.todosRepository.findAll();
  }

  async findOne(id: number) {
    const todo = await this.todosRepository.findOne(id);

    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }

    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    await this.findOne(id);

    if (updateTodoDto.categoryId) {
      await this.categoriesService.findOne(updateTodoDto.categoryId);
    }

    return this.todosRepository.update(id, updateTodoDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.todosRepository.remove(id);
  }
}
