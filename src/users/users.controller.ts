import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse,} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
  findMyEvents(@Req() req: { user: { id: number } }) {
    return this.usersService.findMyEvents(req.user.id);
  }

  @Get('me/registrations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'События, куда записан текущий пользователь' })
  @ApiResponse({ status: 200, description: 'Список регистраций' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  findMyRegistrations(@Req() req: { user: { id: number } }) {
    return this.usersService.findMyRegistrations(req.user.id);
  }
}