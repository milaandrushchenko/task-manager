import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
