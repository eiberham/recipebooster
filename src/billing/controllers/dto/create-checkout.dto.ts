import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCheckoutDto {
    @ApiProperty({ example: 'cus_12345' })
    @IsString()
    @IsNotEmpty()
    customerId: string;

    @ApiProperty({ example: 'price_12345' })
    @IsString()
    @IsNotEmpty()
    priceId: string;
}