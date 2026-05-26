import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TodosRepository } from './todos.repository';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CategoriesService } from 'src/categories/categories.service';

const MAX_TASKS_PER_CATEGORY = 5;
@Injectable()
export class TodosService {
  constructor(
    private readonly todosRepository: TodosRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createTodoDto: CreateTodoDto) {
    await this.categoriesService.findOne(createTodoDto.categoryId);

    const tasksCount = await this.todosRepository.countByCategoryId(
      createTodoDto.categoryId,
    );

    if (tasksCount >= MAX_TASKS_PER_CATEGORY) {
      throw new BadRequestException(
        `Category with id ${createTodoDto.categoryId} already has the maximum limit of 5 tasks`,
      );
    }

    return this.todosRepository.create(createTodoDto);
  }

  async findAll(categoryId?: number) {
    return this.todosRepository.findAll(categoryId);
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
