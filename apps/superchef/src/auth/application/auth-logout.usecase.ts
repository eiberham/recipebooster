import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthLogoutUsecase {
    async logout(): Promise<void> {
        return this.authService.logout()
    }   
}