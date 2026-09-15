import { Controller, Post, Param, UseGuards, ParseIntPipe, Delete } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('events')
export class RegistrationController {
  constructor(private registrationService: RegistrationService) {}

  @Post(':id/register')
  @UseGuards(JwtAuthGuard)
  register(
    @Param('id', ParseIntPipe) eventId: number,
    @CurrentUser() user: any,
  ) {
    return this.registrationService.register(eventId, user.userId);
  }

  @Delete(':id/unregister')
  @UseGuards(JwtAuthGuard)
  unregister(
    @Param('id', ParseIntPipe) eventId: number,
    @CurrentUser() user: any,
  ) {
    return this.registrationService.unregister(eventId, user.userId);
  }
}