import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../domain/user.interface';
import { UserNotFoundException } from '../../common/exceptions/user-not-found.exception';
import { UserResponseData } from '../domain/user.interface';

@Injectable()
export class GetUserUsecase{
    constructor(
        @Inject('USER_REPOSITORY') 
        private readonly userRepository: UserRepository
    ) {}

    async getUserById(id: number): Promise<UserResponseData | null> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new UserNotFoundException();
        }
        return user;
    }
}