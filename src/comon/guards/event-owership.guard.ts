import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../events/entities/event.entity';

@Injectable()
export class EventOwnershipGuard implements CanActivate {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { id: number }; params: { id: string } }>();

    const userId = request.user?.id;
    if (!userId) {
      throw new ForbiddenException('User is not authenticated');
    }

    const eventId = Number(request.params.id);
    if (Number.isNaN(eventId)) {
      throw new NotFoundException('Event not found');
    }

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['user'],
    });

    if (!event) {
      throw new NotFoundException(`Event with id ${eventId} not found`);
    }

    if (event.user?.id !== userId) {
      throw new ForbiddenException('You are not the owner of this event');
    }

    return true;
  }
}