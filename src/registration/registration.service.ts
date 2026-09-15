import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registration } from './entities/registration.entity';
import { Event } from '../events/entities/event.entity';


@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

    async register(eventId: number, userId: number) {
        const event = await this.eventRepository.findOne({ where: { id: eventId } });

        if (!event) {
            throw new NotFoundException('Мероприятие не найдено');
        }


        const existing = await this.registrationRepository.findOne({
        where: { user: { id: userId }, event: { id: eventId } },
        });

        if (existing) {
        throw new ConflictException('Вы уже записаны на это мероприятие');
        }

        const currentRegistrations = await this.registrationRepository.count({
        where: { event: { id: eventId } },
        });

        if (currentRegistrations >= event.capacity) {
        throw new ConflictException('Свободных мест больше нет');
        }

        const registration = this.registrationRepository.create({
            user: { id: userId },
            event: { id: eventId },
        });

        return this.registrationRepository.save(registration);
    }

    async unregister(eventId: number, userId: number) {
        const existing = await this.registrationRepository.findOne({
        where: { user: { id: userId }, event: { id: eventId } },
        });
        if (!existing) {
        throw new NotFoundException('Вы не записаны на это мероприятие');
        }
        
        await this.registrationRepository.remove(existing);   
    }

    
}