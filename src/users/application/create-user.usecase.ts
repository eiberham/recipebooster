import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../domain/user.interface';
import type { UserResponseDto } from '../controllers/dto/user-response.dto';
import { CreateUserDto } from '../controllers/dto/create-user.dto';

@Injectable()
export class CreateUserUsecase{
    constructor(
        @Inject('USER_REPOSITORY') 
        private readonly userRepository: UserRepository
    ) {}

    async createUser( userData : CreateUserDto ): Promise<UserResponseDto> {
        return this.userRepository.create(userData)
    }
}