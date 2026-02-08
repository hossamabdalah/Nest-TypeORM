import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Between, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  create(createProductDto: CreateProductDto, currentUser: any) {
    const { name, description, price } = createProductDto;
    const product = this.productRepository.create({
      name,
      description,
      price,
      user: currentUser,
    });
    return this.productRepository.save(product);
  }

  findAll(name?: string, minPrice?: string, maxPrice?: string) {
    const Filters = {
      ...(name
        ? {
            name: Like(`%${name.toLocaleLowerCase()}%`),
          }
        : {}),
      ...(minPrice && maxPrice
        ? { price: Between(parseInt(minPrice), parseInt(maxPrice)) }
        : {}),
    };
    return this.productRepository.find({
      where:Filters,
      relations: ['user'],
    });
  }

  findOne(id: number) {
    const product = this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    currentUser: any,
  ) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    if (product.user.id !== currentUser.id) {
      throw new ForbiddenException(
        'you are only alowed to update your own products!',
      );
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number, currentUser: any) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    if (product.user.id !== currentUser.id) {
      throw new ForbiddenException(
        'you are only alowed to delete your own products!',
      );
    }
    return this.productRepository.remove(product);
  }
}
