import { Category } from 'src/categories/entities/categories.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';



@Entity()
export class Event {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Концерт рок-группы' })
  title: string;

  @ApiPropertyOptional({ example: 'Живой звук' })
  description?: string;

  @ApiProperty({ example: '2026-05-01' })
  date: string;

  @PrimaryGeneratedColumn()
  id!: number; 

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  date!: Date;

  @Column()
  address!: string;

  @Column()
  location!: string;

  @Column({
    type: 'decimal',
  })
  price!: number;

  @Column()
  capacity!: number;

  @Column()
  coverUrl!: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(()=>Category)
  category!: Category;

}