import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { GetProductDto, InsertProductDto } from './dto/product.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Insert new product' })
  @ApiResponse({
    status: 201,
    description: 'Created',
    schema: {
      example: {
        message: 'Product created successfully',
      },
    },
  })
  @Post()
  insert(@Request() req, @Body() insertDto: InsertProductDto) {
    return this.productService.insertProduct(insertDto, req.user);
  }

  @ApiOperation({ summary: 'Get product' })
  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number): Promise<GetProductDto> {
    console.log(id);
    return this.productService.getProductById(id);
  }

  @ApiOperation({ summary: 'Get all products' })
  @Get()
  getProducts() {
    return this.productService.getProducts();
  }
}
