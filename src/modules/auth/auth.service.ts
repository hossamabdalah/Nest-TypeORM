import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../user/dto/login-user.dto';
import { CookieOptions, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

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
      secure: this.configService.get('NODE_ENV') === 'production',
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
    console.log(user);
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
        name: user.userName,
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

}
