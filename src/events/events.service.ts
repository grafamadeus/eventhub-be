import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FindEventsQueryDto } from './dto/find-events-query.dto';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  private events: Event[] = [];
  private nextId = 1;

  // GET /events?title=...&categoryId=...
  findAll(query: FindEventsQueryDto): Event[] {
    let result = [...this.events];

    if (query.title) {
      const q = query.title.toLowerCase();
      result = result.filter((e) => e.title.toLowerCase().includes(q));
    }

    if (query.categoryId !== undefined) {
      result = result.filter((e) => e.categoryId === query.categoryId);
    }

    return result;
  }

  // GET /events/:id
  findOne(id: number): Event {
    const event = this.events.find((e) => e.id === id);
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }

  // POST /events
  create(dto: CreateEventDto): Event {
    const newEvent: Event = {
      id: this.nextId++,
      ...dto,
    };
    this.events.push(newEvent);
    return newEvent;
  }

  // PATCH /events/:id
  update(id: number, dto: UpdateEventDto): Event {
    const event = this.findOne(id);
    Object.assign(event, dto);
    return event;
  }

  // DELETE /events/:id
  remove(id: number): void {
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    this.events.splice(index, 1);
  }
}