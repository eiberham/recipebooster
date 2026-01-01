export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    preferences?: UserPreferences;
    createdAt: Date;
    updatedAt: Date;
    userRoles?: UserRole[];
}

interface UserRole {
    role: {
        name: string;
    }
}

const diet = {
    none : 'none',
    vegan: 'vegan',
    vegetarian: 'vegetarian',
    omnivore: 'omnivore'
} as const

type Diet = (typeof diet)[keyof typeof diet]

export interface UserPreferences {
    diet: Diet;
    allergies: string[];
}

import type { CreateUserDto } from '../controllers/dto/create-user.dto';
import type { UpdateUserDto } from '../controllers/dto/update-user.dto';
import type { UserResponseDto } from '../controllers/dto/user-response.dto';

export interface UserRepository {
    findAll(): Promise<UserResponseDto[]>;
    findById(id: number): Promise<UserResponseDto | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: Partial<CreateUserDto>): Promise<UserResponseDto>;
    update(id: number, user: UpdateUserDto): Promise<UserResponseDto>;
    delete(id: number): Promise<UserResponseDto>;
}