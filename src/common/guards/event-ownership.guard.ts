import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../events/entities/event.entity';

@Injectable()
export class EventOwnershipGuard implements CanActivate {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const eventId = Number(request.params.id);

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: { user: true },
    });

    if (!event) {
      throw new NotFoundException('Мероприятие не найдено');
    }

    if (event.user.id !== user.userId) {
      throw new ForbiddenException('Вы не владелец этого мероприятия');
    }

    return true;
  }
}