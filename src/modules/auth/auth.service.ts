import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../user/dto/login-user.dto';
import { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config/dist/config.service';
import * as bcrypt from 'bcryptjs';
import { create } from 'domain';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  private getCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: Number(this.configService.get('JWT_EXPIRES_IN')),
      path: '/',
    };
  }
  async register(res: Response, createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    const token = this.jwtService.sign({ id: user.id });
    res.cookie('access_token', token, this.getCookieOptions());
    return {
      message: 'register sucessfully',
      user: {
        name: user.userName,
        email: user.email,
        token: token,
      },
    };
  }
  async login(res: Response, loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findOne(email);
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new BadRequestException('Invalid email or password');
    }
    const token = this.jwtService.sign({
      id: user.id,
      usertype: user.userType,
    });
    res.cookie('access_token', token, this.getCookieOptions());

    return {
      message: 'Logged in successfully',
      user: {
        email: user.email,
        password: user.password,
        token: token,
      },
    };
  }
  async logout(res: Response) {
    res.clearCookie('access_token', this.getCookieOptions());
    return {
      message: 'Logged out successfully',
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
