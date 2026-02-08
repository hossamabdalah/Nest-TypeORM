import {
  BadRequestException,
  ForbiddenException,
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
import { JWTPayloadtype } from 'src/utils/types';
import { userType } from 'src/utils/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
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

  async findOne(email: string) {
    const user = await this.user.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`invalid email or password`);
    }
    return user;
  }
  async update(id: number, updateUserDto: UpdateUserDto, currentUser: any) {
    if (currentUser.userType !== userType.admin && currentUser.id !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    const user = await this.user.preload({
      id: id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.user.save(user);
  }
  async delete(id: number, currentUser: any) {
    if (currentUser.userType !== userType.admin && currentUser.id !== id) {
      throw new ForbiddenException('You can only delete your own profile');
    }
    const user = await this.user.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.user.remove(user);
  }
}
