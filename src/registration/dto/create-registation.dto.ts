import { IsNumber, IsPositive, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRegistrationDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsPositive()
  userId: number;

  @ApiPropertyOptional({ example: 'досум менен болом' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  comment?: string;
}