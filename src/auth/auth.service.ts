import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create(dto.email, hashedPassword, dto.name);

    const { password, ...userWithoutPassword } = user;

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { ...userWithoutPassword, access_token: token };
  }
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Неправильный логин или пароль');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Неправильный логин или пароль');
    }

    const { password, ...userWithoutPassword } = user;

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { ...userWithoutPassword, access_token: token };
  }
}