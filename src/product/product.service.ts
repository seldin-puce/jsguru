import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { GetProductDto, InsertProductDto } from './dto/product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPaginator } from 'prisma-pagination';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async deleteProduct(id: number, user): Promise<boolean> {
    //delete product only if userId is the owner

    try {
      const deletedPost = await this.prisma.product.delete({
        where: {
          id: id,
          userId: user.sub,
        },
      });

      if (deletedPost) {
        console.log(`Deleted product with ID ${id}`);
        return true;
      }
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `Product with ID ${id} not found or doesn't meet the condition.`,
        );
      }
      console.error(`Error deleting product: ${error.message}`);
      throw new HttpException('Error deleting product', 500);
    }
  }
  getProducts(page: number, perPage: number) {
    const paginate = createPaginator({ perPage });

    return paginate<GetProductDto, Prisma.ProductFindManyArgs>(
      this.prisma.product,
      {
        where: {},
        orderBy: {
          id: 'asc',
        },
      },
      {
        page,
      },
    );
  }

  async getProductById(id: number): Promise<GetProductDto> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });
      return product;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }

  insertProduct(insertDto: InsertProductDto, user) {
    return this.prisma.product.create({
      data: {
        name: insertDto.name,
        price: insertDto.price,
        description: insertDto.description,
        quantity: insertDto.quantity,
        userId: user.sub,
      },
    });
  }
}
