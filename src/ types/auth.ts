export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    type: string;
    id: number;
    username: string;
    email: string;
    role: UserRole;
}

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    phone: string;
    cin: string;
    address: string;
    employed: boolean;
    monthlyIncome?: number;
    profession?: string;
    role?: UserRole;
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    phone: string;
    cin: string;
    address: string;
    employed: boolean;
    monthlyIncome?: number;
    profession?: string;
    fullname?: string;
}

export enum UserRole {
    CLIENT = 'CLIENT',
    AGENT = 'AGENT',
    ADMIN = 'ADMIN'
}