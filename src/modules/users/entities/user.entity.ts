// src/modules/users/entities/user.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  OneToMany
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 50, default: 'Músico' })
  rol: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ubicacion: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];

  @OneToMany(() => Product, (product) => product.user)
products!: Product[];
}