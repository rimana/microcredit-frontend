import { User } from './auth';

export interface CreditRequestDTO {
    amount: number;
    duration: number;
    purpose: string;
    monthlyIncome: number;        // AJOUTÉ: requis pour le scoring
    isFunctionnaire: boolean;     // CHANGÉ: optionnel → requis
    employed: boolean;            // AJOUTÉ: requis pour le scoring
    age: number;                  // AJOUTÉ: requis pour le scoring
    profession: string;           // AJOUTÉ: requis pour le scoring
    hasGuarantor: boolean;        // AJOUTÉ: requis pour le scoring
    interestRate?: number;        // OPTIONNEL: gardé si nécessaire
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
    monthlyIncome: number;        // AJOUTÉ
    isFunctionnaire: boolean;
    employed: boolean;            // AJOUTÉ
    age: number;                  // AJOUTÉ
    profession: string;           // AJOUTÉ
    hasGuarantor: boolean;        // AJOUTÉ

    // Champs de scoring ML
    score?: number;               // AJOUTÉ
    riskLevel?: 'FAIBLE' | 'MOYEN' | 'ÉLEVÉ';  // AJOUTÉ
    probabilityDefault?: number;  // AJOUTÉ
    recommendation?: string;      // AJOUTÉ
    redFlags: string[];           // AJOUTÉ
    positiveFactors: string[];    // AJOUTÉ
    maxRecommendedAmount?: number; // AJOUTÉ
    suggestedDuration?: number;   // AJOUTÉ

    // Garant (gardé pour compatibilité)
    guarantorName?: string;
    guarantorCin?: string;
    guarantorPhone?: string;
    guarantorAddress?: string;

    // Fichiers
    idCardFilePath?: string;
    photosFilePath?: string;
    salaryCertificatePath?: string;
    workCertificatePath?: string;
    guarantorFilesPath?: string;

    // Statut avec plus d'options
    status: CreditStatus;

    // Métadonnées
    createdAt: string;
    updatedAt: string;            // AJOUTÉ
    reviewedBy?: string;          // AJOUTÉ
    reviewedAt?: string;          // AJOUTÉ
    agentNotes?: string;          // AJOUTÉ

    user: User;
}

export enum CreditStatus {
    PENDING = 'PENDING',
    IN_REVIEW = 'IN_REVIEW',      // AJOUTÉ
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',      // AJOUTÉ
    PAID = 'PAID'
}

// === NOUVELLES INTERFACES POUR LE SCORING ML ===

export interface ScoringResponseDTO {
    score: number;
    riskLevel: 'FAIBLE' | 'MOYEN' | 'ÉLEVÉ';
    probabilityDefault: number;
    recommendation: string;
    maxRecommendedAmount: number;
    suggestedDuration: number;
    redFlags: string[];
    positiveFactors: string[];
}

export interface CreditReviewDTO {
    decision: 'APPROVED' | 'REJECTED' | 'NEEDS_MORE_INFO';
    agentNotes?: string;
    finalAmount?: number;
    finalDuration?: number;
    conditions?: string[];
    feedbackToClient?: string;
}

export interface CreditStats {
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    averageProcessingTime: number;
    approvalRate: number;
    averageScore: number;
    riskDistribution: {
        FAIBLE: number;
        MOYEN: number;
        ÉLEVÉ: number;
    };
    amountDistribution: {
        '<10000': number;
        '10000-30000': number;
        '30000-50000': number;
        '>50000': number;
    };
}

export interface CreditAuditLog {
    id: number;
    creditId: number;
    action: string;
    performedBy: string;
    performedById: number;
    oldValue?: any;
    newValue?: any;
    timestamp: string;
    ipAddress?: string;
}

export interface AgentPerformance {
    agentId: number;
    agentName: string;
    totalReviewed: number;
    approved: number;
    rejected: number;
    averageProcessingTime: number;
    approvalRate: number;
}