import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('registrations')
@Controller('events')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post(':id/register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Записаться на событие' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 201, description: 'Записан' })
  @ApiResponse({ status: 400, description: 'Мест нет' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Событие или юзер не найдены' })
  @ApiResponse({ status: 409, description: 'Уже записан' })
  register(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateRegistrationDto,
    @Req() req: { user: { id: number } },
  ) {
    return this.registrationsService.register(id, req.user.id, dto);
  }

  @Get(':id/registrations')
  @ApiOperation({ summary: 'Список регистраций на событие' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Список регистраций' })
  @ApiResponse({ status: 404, description: 'Событие не найдено' })
  findAllByEvent(@Param('id', ParseIntPipe) id: number) {
    return this.registrationsService.findAllByEvent(id);
  }

  @Delete(':id/register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Отменить запись на событие' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 204, description: 'Запись отменена' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Регистрация не найдена' })
  @HttpCode(HttpStatus.NO_CONTENT)
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { id: number } },
  ) {
    return this.registrationsService.cancel(id, req.user.id);
  }
}