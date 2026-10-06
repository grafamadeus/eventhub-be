import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';

import { Event } from './entities/event.entity';
import { Registration } from '../registration/entities/registration.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FindEventsQueryDto } from './dto/find-events-query.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Registration)
    private readonly registrationRepository: Repository<Registration>,
  ) {}

  // GET /events?title=...&categoryId=...&page=...&limit=...
  async findAll(query: FindEventsQueryDto) {
    const where: FindOptionsWhere<Event> = {};

    if (query.title) {
      where.title = Like(`%${query.title}%`);
    }

    if (query.categoryId !== undefined) {
      where.category = { id: query.categoryId };
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 12;

    const [items, total] = await this.eventRepository.findAndCount({
      where,
      relations: { category: true, user: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items: await this.withRegistrationsCount(items), total };
  }

  // GET /events/:id
  async findOne(id: number) {
    const event = await this.findEntity(id);
    const [withCount] = await this.withRegistrationsCount([event]);
    return withCount;
  }

  // POST /events
  async create(dto: CreateEventDto, userId: number) {
    const { categoryId, ...rest } = dto;

    const event = this.eventRepository.create({
      ...rest,
      category: { id: categoryId },
      user: { id: userId },
    });

    const saved = await this.eventRepository.save(event);
    return this.findOne(saved.id);
  }

  // PATCH /events/:id
  async update(id: number, dto: UpdateEventDto) {
    const event = await this.findEntity(id);

    const { categoryId, ...rest } = dto;

    Object.assign(event, rest);

    if (categoryId !== undefined) {
      event.category = { id: categoryId } as Event['category'];
    }

    await this.eventRepository.save(event);

    return this.findOne(id);
  }

  // DELETE /events/:id
  async remove(id: number): Promise<void> {
    const event = await this.findEntity(id);
    await this.eventRepository.remove(event);
  }

  // Достаёт событие из базы как есть, без счётчика
  private async findEntity(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: { category: true, user: true },
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    return event;
  }

  // Добавляет каждому событию поле registrationsCount одним запросом
  async withRegistrationsCount(events: Event[]) {
    if (events.length === 0) return [];

    const ids = events.map((e) => e.id);

    const rows = await this.registrationRepository
      .createQueryBuilder('r')
      .innerJoin('r.event', 'e')
      .select('e.id', 'eventId')
      .addSelect('COUNT(r.id)', 'count')
      .where('e.id IN (:...ids)', { ids })
      .groupBy('e.id')
      .getRawMany<{ eventId: number; count: string }>();

    const countByEvent = new Map(
      rows.map((row) => [Number(row.eventId), Number(row.count)]),
    );

    return events.map((event) => ({
      ...event,
      registrationsCount: countByEvent.get(event.id) ?? 0,
    }));
  }
}