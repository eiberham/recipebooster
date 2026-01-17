import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLogoutDto {
    @ApiProperty({ example: '1' })
    @IsNumber()
    userId: number;

    @ApiProperty({ example: 'device-id-1234' })
    @IsString()
    deviceId: string;
}