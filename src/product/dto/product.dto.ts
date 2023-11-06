import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ProductDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  quantity: number;
}

export class InsertProductDto extends ProductDto {}

export class GetProductDto extends ProductDto {
  id: number;
  userId: number;
}
