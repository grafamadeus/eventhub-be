import { Controller, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@ApiTags('registrations')
@Controller('events')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post(':id/register')
  @ApiOperation({ summary: 'Записаться на событие' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: 'Записан' })
  @ApiResponse({ status: 400, description: 'Мест нет' })
  @ApiResponse({ status: 404, description: 'Событие/юзер не найдены' })
  @ApiResponse({ status: 409, description: 'Уже записан' })
  register(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateRegistrationDto,
  ) {
    return this.registrationsService.register(id, dto);
  }
}