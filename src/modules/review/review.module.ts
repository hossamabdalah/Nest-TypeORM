import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from './entities/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { Product } from '../product/entities/product.entity';
import { User } from '../user/entities/user.entity';

const schema = [Review, Product, User];
@Module({
  imports: [TypeOrmModule.forFeature(schema),ProductModule,UserModule],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
