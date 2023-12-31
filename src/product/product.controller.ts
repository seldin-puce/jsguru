import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { GetProductDto, InsertProductDto } from './dto/product.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response';
import { PaginatedOutputDto } from 'src/common/dto/paginated-output.dto';

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
    return this.productService.getProductById(id);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiPaginatedResponse(GetProductDto)
  @Get()
  getProducts(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
  ): Promise<PaginatedOutputDto<GetProductDto>> {
    return this.productService.getProducts(page, perPage);
  }

  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({
    status: 200,
    description: 'Deleted',
    schema: {
      example: {
        message: 'Product deleted successfully',
      },
    },
  })
  @Delete(':id')
  delete(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    return this.productService.deleteProduct(id, req.user);
  }
}
