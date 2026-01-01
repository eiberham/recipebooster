import { IsEmail, IsNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import type { UserPreferences } from '../../domain/user.interface';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'johndoe' })
    @IsString()
    username: string;

    @ApiProperty({ example: 'password' })
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: '{ diet: "vegan", allergies: ["nuts"] }' })
    @IsNotEmpty()
    preferences?: UserPreferences;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    @ApiProperty({ example: ['admin', 'viewer'], required: false })
    roles?: string[];
}