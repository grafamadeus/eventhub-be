import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { Event } from '../events/entities/event.entity';
import { Registration } from '../registrations/entities/registration.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(Registration)
    private readonly registrationRepository: Repository<Registration>,
  ) {}

  async findMe(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findMyEvents(userId: number): Promise<Event[]> {
    return this.eventRepository.find({
      where: { user: { id: userId } },
      relations: ['category', 'user'],
      order: { date: 'ASC' },
    });
  }

  async findMyRegistrations(userId: number): Promise<Registration[]> {
    return this.registrationRepository.find({
      where: { user: { id: userId } },
      relations: ['event', 'event.category', 'event.user'],
      order: { createdAt: 'DESC' },
    });
  }
}