import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiListResponse } from 'src/common/types/api-response.type';
import { Category } from 'src/generated/prisma/client';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ApiListResponse<Category>> {
    const categories = await this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return {
      list: categories,
    };
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({ where: { id } });
  }
}
