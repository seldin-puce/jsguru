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

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class InsertProductDto extends ProductDto {}

export class GetProductDto extends ProductDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;
}
