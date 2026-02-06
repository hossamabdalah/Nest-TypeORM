import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JWTPayloadtype } from 'src/utils/types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll() {
    const user = await this.user.find();
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const { userName, email, password } = createUserDto;
    const Useremail = await this.user.findOne({ where: { email } });
    if (Useremail) {
      throw new BadRequestException(`Email ${email} already exists`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = this.user.create({
      userName: userName,
      email: email,
      password: hashedPassword,
    });
    return await this.user.save(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.user.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException(`User with email ${email} not found`);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException(`Invalid password`);
    }
    const token = await this.generateToken({
      id: user.id,
      usertype: user.userType,
    });
    return { token };
  }
  private async generateToken(payload: JWTPayloadtype) {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  async findOne(email: string) {
    const user = await this.user.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`invalid email or password`);
    }
    return user;  
  }
  async update(id: number, UpdateUserDto: UpdateUserDto) {
    const user = await this.user.preload({
      id: id,
      ...UpdateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.user.save(user);
  }
  // async remove(id: number) {
  //   const user = await this.findOne(id);
  //   if (!user) {
  //     throw new NotFoundException(`User #${id} not found`);
  //   }
  //   return this.user.remove(user);
  // }
}
