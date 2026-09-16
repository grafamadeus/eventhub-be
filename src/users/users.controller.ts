import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me/events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'События текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Список событий' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  findMyEvents(@CurrentUser() user: any) {
    return this.usersService.findMyEvents(user.userId);
  }

  @Get('me/registrations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'События, куда записан текущий пользователь' })
  @ApiResponse({ status: 200, description: 'Список регистраций' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  findMyRegistrations(@CurrentUser() user: any) {
    return this.usersService.findMyRegistrations(user.userId);
  }
}