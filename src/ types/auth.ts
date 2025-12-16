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
    // Ajoute ces champs s'ils sont retournés par le backend
    phone?: string;
    cin?: string;
    address?: string;
    employed?: boolean;
    monthlyIncome?: number;
    profession?: string;
    fullname?: string;
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
    adminSecret?: string; // Ajouter ce champ
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