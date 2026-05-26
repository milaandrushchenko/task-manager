import { IsArray, IsInt } from 'class-validator';

export class BulkUpdateTodoDto {
  @IsArray()
  @IsInt({ each: true })
  ids: number[];
}
