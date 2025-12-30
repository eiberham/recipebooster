import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../domain/user.interface';
import type { UserResponseDto } from '../controllers/dto/user-response.dto';
import { UserNotFoundException } from '../../common/exceptions/user-not-found.exception';

@Injectable()
export class GetUserUsecase{
    constructor(
        @Inject('USER_REPOSITORY') 
        private readonly userRepository: UserRepository
    ) {}

    async getUserById(id: number): Promise<UserResponseDto | null> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new UserNotFoundException();
        }
        return user;
    }
}