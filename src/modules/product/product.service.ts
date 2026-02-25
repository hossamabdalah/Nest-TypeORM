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
import { QueryProductDto } from './dto/query-product.dto';

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

  async findAll(
  query:QueryProductDto
  ) {
    const {page,limit,name,minPrice,maxPrice}=query;
    const filters: any = {};

    if (name) {
      filters.name = Like(`%${name.toLowerCase()}%`);
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      filters.price = Between(minPrice, maxPrice);
    } else if (minPrice !== undefined) {
      filters.price = Between(minPrice, Number.MAX_SAFE_INTEGER);
    } else if (maxPrice !== undefined) {
      filters.price = Between(0, maxPrice);
    }

    const [data, total] = await this.productRepository.findAndCount({
      where: filters,
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
    });

    return {
      data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
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
    const product = await this.getProductBy(id);
    if (product.user.id !== currentUser.id) {
      throw new ForbiddenException(
        'you are only alowed to update your own products!',
      );
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number, currentUser: any) {
    const product = await this.getProductBy(id);
    if (product.user.id !== currentUser.id) {
      throw new ForbiddenException(
        'you are only alowed to delete your own products!',
      );
    }
    return this.productRepository.remove(product);
  }
  private async getProductBy(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }
}
