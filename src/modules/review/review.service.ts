import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { userType } from 'src/utils/enums';
import { QueryReviewDto } from './dto/query-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User) private readonly userService: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(
    productId: number,
    userId: number,
    createReviewDto: CreateReviewDto,
  ) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    const user = await this.userService.findOne({ where: { id: userId } });
    if (!product) throw new NotFoundException('Product not found');
    if (!user) throw new NotFoundException('User not found');
    const review = this.reviewRepository.create({
      ...createReviewDto,
      product,
      user,
    });

    return this.reviewRepository.save(review);
  }

  async findAll(query: QueryReviewDto) {
    const { page, limit } = query;
    const [data, total] = await this.reviewRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['user'],
    });
    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, userId: number) {
    const review = await this.getReviewBy(id);
    if (!review) {
      throw new NotFoundException('Review not found!!!');
    }
    if (review.user.id !== userId) {
      throw new ForbiddenException('you are not allowed ');
    }
    review.comment = updateReviewDto.comment ?? review.comment;
    review.rating = updateReviewDto.rating ?? review.rating;
    return this.reviewRepository.save(review);
  }
  private async getReviewBy(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (!review) {
      throw new NotFoundException('review is not found');
    }
    return review;
  }

  async delete(id: number, userId: number, usertype: userType) {
    const review = await this.getReviewBy(id);
    if (review.user.id === userId || usertype === userType.admin) {
      await this.reviewRepository.remove(review);
      return { message: `this ${id} has been deleted` };
    }
    throw new UnauthorizedException('you are not allowed!');
  }
}
