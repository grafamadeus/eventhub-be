import { Category } from 'src/categories/entities/categories.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Event {

  @PrimaryGeneratedColumn()
  id!: number; 

  @Column()
  title!: string;

  @Column({nullable: true})
  description?: string;

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