import { Product } from 'src/modules/product/entities/product.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;
  @Column()
  comment: string;

  @ManyToOne(() => Product, (product) => product.review)
  product: Product;
  @ManyToOne(() => User, (user) => user.review)
  user: User;
}
