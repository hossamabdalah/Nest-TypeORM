import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
const schema=[User];
@Module({
  imports: [TypeOrmModule.forFeature(schema),JwtModule.registerAsync({
    inject:[ConfigService],
    useFactory: (config: ConfigService) => ({
      global:true,
      secret:config.get('JWT_SECRET'),
      signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') },
    }),
  })],
  controllers: [UserController],
  providers: [UserService],
  exports :[UserService]
})
export class UserModule {}
