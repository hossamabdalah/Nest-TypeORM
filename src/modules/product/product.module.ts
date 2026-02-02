import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
const schema = [Product];
@Module({
  imports: [TypeOrmModule.forFeature(schema)],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
