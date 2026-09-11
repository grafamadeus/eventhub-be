import { User } from 'src/users/entities/user.entity';
import { Event } from 'src/events/entities/event.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class Registration {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Event)
  event!: Event;

  @CreateDateColumn()
  createdAt!: Date;
}