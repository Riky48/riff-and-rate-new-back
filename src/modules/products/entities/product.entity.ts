import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150 })
  titulo!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column({
  type: 'decimal',
  precision: 10,
  scale: 2,
  transformer: {
    to: (value: number) => value,
    from: (value: string) => parseFloat(value) // ¡Mapea de string decimal a número de JS!
  }
})
precio!: number;

  @Column({ type: 'varchar', length: 50, default: 'Usado' })
  condicion!: string; // 'Nuevo' o 'Usado'

  @Column({ type: 'varchar', length: 100 })
  categoria!: string; // 'Guitarras', 'Bajos', 'Baterías', 'Pedales', 'Audio'

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagenUrl?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // --- RELACIÓN CON VENDEDOR ---
  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: number;
}
