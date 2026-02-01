import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
constructor(@InjectRepository(User) private readonly user: Repository<User>){}

async findAll(){
  const user=await this.user.find();
  return user;
}
 create(createUserDto:CreateUserDto){ 
  const user= this.user.create(createUserDto);
return this.user.save(user)
}
async findOne(id:number){
  const user=await this.user.findOneBy({id});
  return user;  
}
async update(id:number,UpdateUserDto:UpdateUserDto){
  const user=await this.user.preload({
    id:id,
    ...UpdateUserDto
  })

if(!user){
  throw new NotFoundException(`User #${id} not found`);
}
return this.user.save(user);
}
async remove(id:number){
  const user=await this.findOne(id)
  if (!user) {
    throw new NotFoundException(`User #${id} not found`); 
  } 
  return  this.user.remove(user)
}

}
