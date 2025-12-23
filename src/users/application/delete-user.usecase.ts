import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../domain/user.interface';

@Injectable()
export class DeleteUserUsecase{
    constructor(
        @Inject('USER_REPOSITORY') 
        private readonly userRepository: UserRepository
    ) {}

    async deleteUser(id: number): Promise<void> {
        return this.userRepository.delete(id)
    }
}