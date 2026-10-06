import { Controller, Post, Get, Delete, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RegistrationService } from './registration.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { EventOwnershipGuard } from '../common/guards/event-ownership.guard';

@ApiTags('registrations')
@Controller('events')
export class RegistrationController {
  constructor(private registrationService: RegistrationService) {}

  @Post(':id/register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Записаться на событие' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 201, description: 'Записан' })
  @ApiResponse({ status: 409, description: 'Уже записан или мест нет' })
  register(
    @Param('id', ParseIntPipe) eventId: number,
    @CurrentUser() user: any,
  ) {
    return this.registrationService.register(eventId, user.userId);
  }

  @Get(':id/registrations')
  @UseGuards(JwtAuthGuard, EventOwnershipGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Список регистраций на событие (только владелец)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Список регистраций' })
  @ApiResponse({ status: 403, description: 'Не владелец' })
  findAllByEvent(@Param('id', ParseIntPipe) eventId: number) {
    return this.registrationService.findAllByEvent(eventId);
  }

  @Delete(':id/unregister')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Отменить запись на событие' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Запись отменена' })
  @ApiResponse({ status: 404, description: 'Регистрация не найдена' })
  unregister(
    @Param('id', ParseIntPipe) eventId: number,
    @CurrentUser() user: any,
  ) {
    return this.registrationService.unregister(eventId, user.userId);
  }
}