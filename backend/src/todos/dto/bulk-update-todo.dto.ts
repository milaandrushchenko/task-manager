import { IsArray, IsBoolean, IsNumber } from 'class-validator';

export class BulkUpdateTodoDto {
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];

  @IsBoolean()
  completed: boolean;
}
