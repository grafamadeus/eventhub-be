import { Category } from 'src/categories/entities/categories.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Event {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 'Концерт рок-группы' })
  @Column()
  title!: string;

  @ApiPropertyOptional({ example: 'Живой звук' })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ example: '2026-05-01' })
  @Column()
  date!: Date;

  @ApiProperty({ example: 'ул. Пушкина, д. 10' })
  @Column()
  address!: string;

  @ApiProperty({ example: 'Москва' })
  @Column()
  location!: string;

  @ApiProperty({ example: 1500 })
  @Column({ type: 'decimal' })
  price!: number;

  @ApiProperty({ example: 100 })
  @Column()
  capacity!: number;

  @ApiProperty({ example: 'https://example.com/cover.jpg' })
  @Column()
  coverUrl!: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Category)
  category!: Category;
}