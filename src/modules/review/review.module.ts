import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from './entities/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
const schema=[Review]
@Module({
  imports: [TypeOrmModule.forFeature(schema)],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
