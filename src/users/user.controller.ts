import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getUsers(@Req() request: Request): Promise<User[]> {
        return this.userService.getUsers();
    }
}