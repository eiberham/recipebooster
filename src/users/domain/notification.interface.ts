import { UserResponseData } from './user.interface';

export interface NotificationService {
    send(user: UserResponseData, subject: string, body: string): Promise<void>
}