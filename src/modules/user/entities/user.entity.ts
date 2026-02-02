import { Product } from 'src/modules/product/entities/product.entity';
import { Review } from 'src/modules/review/entities/review.entity';
import { userType } from 'src/utils/enums';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ type: 'enum', enum: userType, default: 'CUSTOMER' })
  userType: userType;
  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToMany(() => Product, (product) => product.user)
  product: Product[];
  @OneToMany(() => Review, (review) => review.user)
  review: Review[];
}
