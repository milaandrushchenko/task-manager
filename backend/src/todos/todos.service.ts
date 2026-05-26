import { Injectable, NotFoundException } from '@nestjs/common';
import { TodosRepository } from './todos.repository.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';

@Injectable()
export class TodosService {
  constructor(private readonly todosRepository: TodosRepository) {}

  create(createTodoDto: CreateTodoDto) {
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
    return this.todosRepository.update(id, updateTodoDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.todosRepository.remove(id);
  }
}
