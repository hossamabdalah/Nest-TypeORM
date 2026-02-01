import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

@Get()
findall(){
  return this.userService.findAll();
}
@Post()
create(@Body() createUserDto:CreateUserDto){
return this.userService.create(createUserDto)

}
@Get(':id')
findOne(@Param('id',ParseIntPipe) id:number){
  return this.userService.findOne(id);
}
@Delete(':id')
remove(@Param('id',ParseIntPipe) id:number){
  return this.userService.remove(id);
}
@Patch(':id')
update(@Param('id',ParseIntPipe) id:number,@Body() updateUserDto:UpdateUserDto){
  return this.userService.update(id,updateUserDto);
}
}
