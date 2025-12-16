export {  UserRole } from './auth';
// @ts-ignore
export {  User } from './auth';
export interface UserProfile {
    username: string;
    email: string;
    phone: string;
    cin: string;
    address: string;
    employed: boolean;
    monthlyIncome: number;
    profession: string;
}

export interface UpdateProfileRequest {
    email: string;
    phone: string;
    cin: string;
    address: string;
    employed: boolean;
    monthlyIncome: number;
    profession: string;
}
