import { Module } from '@nestjs/common';
import { TodosModule } from './todos/todos.module';
import { CategoriesModule } from './categories/categories.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [TodosModule, CategoriesModule, PrismaModule],
})
export class AppModule {}
