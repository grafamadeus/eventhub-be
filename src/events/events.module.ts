import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventOwnershipGuard } from '../common/guards/event-ownership.guard';
import { Registration } from 'src/registration/entities/registration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Registration])],
  controllers: [EventsController],
  providers: [EventsService, EventOwnershipGuard],
  exports: [EventsService],
})
export class EventsModule {}