import { IsString, IsOptional, IsNumber, IsPositive, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindEventsQueryDto {
  @ApiPropertyOptional({ example: 'рок', description: 'Поиск по части названия' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID категории' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  categoryId?: number;
}