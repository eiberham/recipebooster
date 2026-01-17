import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthLoginUsecase {
    async login(email: string, password: string): Promise<void> {
        return this.authService.login(email, password)
    }
}