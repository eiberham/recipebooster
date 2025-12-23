import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../domain/user.interface';
import type { UserResponseDto } from '../controllers/dto/user-response.dto';

@Injectable()
export class ListUsersUsecase{
    constructor(
        @Inject('USER_REPOSITORY') 
        private readonly userRepository: UserRepository
    ) {}

    async getUsers(): Promise<UserResponseDto[]> {
        return this.userRepository.findAll()
    }
}