// Types pour l'authentification et les utilisateurs

export enum UserRole {
    CLIENT = 'CLIENT',
    AGENT = 'AGENT',
    ADMIN = 'ADMIN'
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    phone?: string;
    cin?: string;
    address?: string;
    employed?: boolean;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    phone: string;
    cin?: string;
    address?: string;
    employed?: boolean;
    role: UserRole;
    adminSecret?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

