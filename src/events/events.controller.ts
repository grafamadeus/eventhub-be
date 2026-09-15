import {
  Controller, Get, Post, Patch, Delete, Param, Query, Body,
  ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth,
} from '@nestjs/swagger';

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FindEventsQueryDto } from './dto/find-events-query.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Список событий с поиском и фильтром' })
  @ApiResponse({ status: 200, description: 'Список событий' })
  @ApiResponse({ status: 400, description: 'Неверные параметры' })
  findAll(@Query() query: FindEventsQueryDto) {
    return this.eventsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить событие по ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Найдено' })
  @ApiResponse({ status: 404, description: 'Не найдено' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @Post()
<<<<<<< HEAD
  @ApiOperation({ summary: 'Создать событие' })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'Создано' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  create(@Body() dto: CreateEventDto) {
    return this.eventsService.create(dto);
=======
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateEventDto, @CurrentUser() user: any) {
    return this.eventsService.create(dto, user.userId);
>>>>>>> 21238485fb7406051d4b9bb4687d4ebf9f1e410e
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить событие' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: 'Обновлено' })
  @ApiResponse({ status: 403, description: 'Не владелец' })
  @ApiResponse({ status: 404, description: 'Не найдено' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить событие' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 204, description: 'Удалено' })
  @ApiResponse({ status: 403, description: 'Не владелец' })
  @ApiResponse({ status: 404, description: 'Не найдено' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}