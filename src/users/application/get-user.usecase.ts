import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../domain/user.interface';
import type { UserResponseDto } from '../controllers/dto/user-response.dto';

@Injectable()
export class GetUserUsecase{
    constructor(
        @Inject('USER_REPOSITORY') 
        private readonly userRepository: UserRepository
    ) {}

    async getUserById(id: number): Promise<UserResponseDto | null> {
        return this.userRepository.findById(id)
    }
}