import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Registration } from './entities/registration.entity';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { Event } from 'src/events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Registration, Event])],
  controllers: [RegistrationController],
  providers: [RegistrationService],
})
export class RegistrationModule {}