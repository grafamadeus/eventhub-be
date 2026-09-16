import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registration } from './entities/registration.entity';
import { Event } from '../events/entities/event.entity';
import { DataSource } from 'typeorm';


@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
    private dataSource: DataSource,
  ) {}

    async register(eventId: number, userId: number) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const event = await queryRunner.manager.findOne(Event, {
            where: { id: eventId },
            lock: { mode: 'pessimistic_write' },
            });

            if (!event) {
            throw new NotFoundException('Мероприятие не найдено');
            }

            const existing = await queryRunner.manager.findOne(Registration, {
            where: { user: { id: userId }, event: { id: eventId } },
            });

            if (existing) {
            throw new ConflictException('Вы уже записаны на это мероприятие');
            }

            const currentRegistrations = await queryRunner.manager.count(Registration, {
            where: { event: { id: eventId } },
            });

            if (currentRegistrations >= event.capacity) {
            throw new ConflictException('Свободных мест больше нет');
            }

            const registration = queryRunner.manager.create(Registration, {
            user: { id: userId },
            event: { id: eventId },
            });
            await queryRunner.manager.save(registration);

            await queryRunner.commitTransaction();
            return registration;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
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