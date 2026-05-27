import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TodosRepository } from './todos.repository';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CategoriesService } from 'src/categories/categories.service';
import { BulkUpdateTodoDto } from './dto/bulk-update-todo.dto';
import { Todo } from 'src/generated/prisma/client';
import {
  ApiActionResponse,
  toActionResponse,
} from 'src/common/types/api-response.type';

const MAX_TASKS_PER_CATEGORY = 5;
@Injectable()
export class TodosService {
  constructor(
    private readonly todosRepository: TodosRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<ApiActionResponse<Todo>> {
    await this.categoriesService.findOne(createTodoDto.categoryId);

    const tasksCount = await this.todosRepository.countByCategoryId(
      createTodoDto.categoryId,
    );

    if (tasksCount >= MAX_TASKS_PER_CATEGORY) {
      throw new BadRequestException(
        `Category with id ${createTodoDto.categoryId} already has the maximum limit of 5 tasks`,
      );
    }

    const todo = await this.todosRepository.create(createTodoDto);

    return toActionResponse(todo);
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

  async update(
    id: number,
    updateTodoDto: UpdateTodoDto,
  ): Promise<ApiActionResponse<Todo>> {
    await this.findOne(id);

    if (updateTodoDto.categoryId) {
      await this.categoriesService.findOne(updateTodoDto.categoryId);
    }

    const updatedTodo = await this.todosRepository.update(id, updateTodoDto);
    return toActionResponse(updatedTodo);
  }

  async remove(id: number) {
    await this.findOne(id);
    const deletedTodo = await this.todosRepository.remove(id);
    return toActionResponse(deletedTodo);
  }

  async updateStatusBulk(dto: BulkUpdateTodoDto) {
    const updatedCount = await this.todosRepository.updateStatusBulk(
      dto.ids,
      dto.completed,
    );

    return toActionResponse({ updatedCount });
  }
}
