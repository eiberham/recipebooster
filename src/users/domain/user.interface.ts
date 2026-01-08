import type { JsonValue } from 'generated/prisma/runtime/client';

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
    stripeCustomerId?: string;
    subscription?: Subscription;
    preferences?: JsonValue;
    createdAt: Date;
    updatedAt: Date | null;
    roles?: string[];
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

export type Subscription = "free" | "basic"

export type UserResponseData = Omit<User, 'password'>
export type CreateUserData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateUserData = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>

export interface UserRepository {
    findAll(): Promise<UserResponseData[]>;
    findById(id: number): Promise<UserResponseData | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: Partial<CreateUserData>): Promise<UserResponseData>;
    update(id: number, user: UpdateUserData): Promise<UserResponseData>;
    delete(id: number): Promise<UserResponseData>;
}