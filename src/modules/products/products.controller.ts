import { Controller, Get, Post, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser('id') userId: number,
  ) {
    return this.productsService.create(createProductDto, userId);
  }

  // GET /products?categoria=Guitarras&minPrecio=100000&buscar=Ibanez
  @Get()
  findAll(@Query() filterDto: GetProductsFilterDto) {
    return this.productsService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }
}