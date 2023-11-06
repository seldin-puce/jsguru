import { Injectable, NotFoundException } from '@nestjs/common';
import { GetProductDto, InsertProductDto } from './dto/product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  getProducts() {
    return this.prisma.product.findMany();
  }

  async getProductById(id: number): Promise<GetProductDto> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });
      console.log(product);
      return product;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      throw error;
    }
  }
  constructor(private readonly prisma: PrismaService) {}

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
