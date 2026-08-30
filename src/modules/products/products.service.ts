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

    // Inicia la construcción de la consulta SQL
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .select([
        'product',
        'user.id',
        'user.nombre',
        'user.email',
        'user.ubicacion',
      ]);

    // Filtro por categoría exacto
    if (categoria) {
      query.andWhere('product.categoria = :categoria', { categoria });
    }

    // Filtro por precio mínimo (Rango)
    if (minPrecio !== undefined) {
      query.andWhere('product.precio >= :minPrecio', { minPrecio });
    }

    // Filtro por precio máximo (Rango)
    if (maxPrecio !== undefined) {
      query.andWhere('product.precio <= :maxPrecio', { maxPrecio });
    }

    // Búsqueda por coincidencia parcial (LIKE) en título o descripción
    if (buscar) {
      query.andWhere(
        '(LOWER(product.titulo) LIKE LOWER(:buscar) OR LOWER(product.descripcion) LIKE LOWER(:buscar))',
        { buscar: `%${buscar}%` },
      );
    }

    // Ordenar siempre por publicaciones más recientes
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