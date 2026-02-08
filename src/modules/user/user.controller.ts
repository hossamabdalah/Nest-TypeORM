import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './decorators/user-role.decorators';
import { userType } from 'src/utils/enums';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guard/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Roles(userType.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  findall() {
    return this.userService.findAll();
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req:any
  ) {
    return this.userService.update(id, updateUserDto,req.user);
  }
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id', ParseIntPipe) id: number, @Req() req:any) {
    return this.userService.delete(id,req.user);
  }
}
