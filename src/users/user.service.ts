import { Injectable, Inject } from '@nestjs/common';
import type { User, UserRepository } from './interfaces/user.interface';

@Injectable()
export class UserService{
    constructor(
        @Inject('USER_REPOSITORY') 
        private readonly userRepository: UserRepository
    ) {}

    private readonly users: User[] = [];

    async getUsers(): Promise<User[]> {
        return this.userRepository.findAll()
    }
}