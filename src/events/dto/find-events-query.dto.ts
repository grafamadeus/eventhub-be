import { IsString, IsOptional, IsNumber, isPositive, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class FindEventsQueryDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsNumber()
  @IsPositive({})
  @IsOptional()
  @Type(() => Number) 
  categoryId?: number;
}