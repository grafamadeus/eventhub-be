import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Event } from '../events/entities/event.entity';
import { Registration } from '../registration/entities/registration.entity';
import { EventsService } from '../events/events.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Event)
    private eventRepository: Repository<Event>,

    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,

    private eventsService: EventsService,
  ) {}

  async create(email: string, password: string, name: string): Promise<User> {
    const user = this.userRepository.create({ email, password, name });
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findMe(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findMyEvents(userId: number) {
    const events = await this.eventRepository.find({
      where: { user: { id: userId } },
      relations: { category: true, user: true },
      order: { date: 'ASC' },
    });

    return this.eventsService.withRegistrationsCount(events);
  }

  async findMyRegistrations(userId: number) {
    const registrations = await this.registrationRepository.find({
      where: { user: { id: userId } },
      relations: { event: { category: true, user: true } },
      order: { createdAt: 'DESC' },
    });

    const eventsWithCount = await this.eventsService.withRegistrationsCount(
      registrations.map((r) => r.event),
    );

    return registrations.map((registration, index) => ({
      ...registration,
      event: eventsWithCount[index],
    }));
  }
}