import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, userId: number) {
    const product = this.productRepository.create({
      ...createProductDto,
      userId,
    });
    return await this.productRepository.save(product);
  }

  async findAll(filterDto: GetProductsFilterDto) {
  const { categoria, minPrecio, maxPrecio, buscar } = filterDto;
  const query = this.productRepository.createQueryBuilder('product')
    .leftJoinAndSelect('product.user', 'user')
    .select([
      'product',
      'user.id',
      'user.nombre',
      'user.email',
      'user.ubicacion',
    ]);

  if (categoria) {
    query.andWhere('product.categoria = :categoria', { categoria });
  }

  if (minPrecio) {
    query.andWhere('product.precio >= :minPrecio', { minPrecio });
  }

  if (maxPrecio) {
    query.andWhere('product.precio <= :maxPrecio', { maxPrecio });
  }

  if (buscar) {
    query.andWhere(
      '(product.titulo LIKE :buscar OR product.descripcion LIKE :buscar)',
      { buscar: `%${buscar}%` }
    );
  }

  query.orderBy('product.createdAt', 'DESC');
  return await query.getMany();
}

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { user: true },
      select: {
        user: { id: true, nombre: true, email: true, ubicacion: true },
      },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }
}