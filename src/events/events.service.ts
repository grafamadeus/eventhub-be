import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';

import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FindEventsQueryDto } from './dto/find-events-query.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  // GET /events?title=...&categoryId=...
  async findAll(query: FindEventsQueryDto): Promise<Event[]> {
    const where: FindOptionsWhere<Event> = {};

    if (query.title) {
      where.title = Like(`%${query.title}%`);
    }

    if (query.categoryId !== undefined) {
      where.category = { id: query.categoryId };
    }

    return this.eventRepository.find({
      where,
      relations: ['category', 'user'],
    });
  }

  // GET /events/:id
  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['category', 'user'],
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    return event;
  }

  // POST /events
  async create(dto: CreateEventDto): Promise<Event> {
    const { categoryId, ...rest } = dto;

    const event = this.eventRepository.create({
      ...rest,
      category: { id: categoryId },
    });

    const saved = await this.eventRepository.save(event);

    // Перезагрузка чтобы получит все category/user а не только { id }
    return this.findOne(saved.id);
  }

  // PATCH /events/:id
  async update(id: number, dto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

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
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
  }
}