import { User } from './auth';

export interface CreditRequestDTO {
    amount: number;
    duration: number;
    interestRate: number;
    purpose: string;
    isFunctionnaire?: boolean;
    guarantorName?: string;
    guarantorCin?: string;
    guarantorPhone?: string;
    guarantorAddress?: string;
}

export interface CreditRequest {
    id: number;
    amount: number;
    duration: number;
    interestRate: number;
    purpose: string;
    isFunctionnaire: boolean;
    guarantorName?: string;
    guarantorCin?: string;
    guarantorPhone?: string;
    guarantorAddress?: string;
    idCardFilePath?: string;
    photosFilePath?: string;
    salaryCertificatePath?: string;
    workCertificatePath?: string;
    guarantorFilesPath?: string;
    status: CreditStatus;
    createdAt: string;
    user: User;
}

export enum CreditStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    PAID = 'PAID'
}