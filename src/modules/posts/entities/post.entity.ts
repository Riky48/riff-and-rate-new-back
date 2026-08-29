import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn, 
  OneToMany
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Rating } from './rating.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  contenido!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagenUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // --- RELACIÓN CON USUARIOS ---
  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: number;

  @OneToMany(() => Rating, (rating) => rating.post)
  ratings!: Rating[];
  
}