export class UserResponseDto {
    id: number;
    name: string;
    email: string;
    preferences?: Record<string, any>;
    roles?: string[];
    createdAt: Date;
    updatedAt: Date;
}