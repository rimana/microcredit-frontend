// Définition des types pour l'administration
export interface AdminStats {
  totalUsers: number;
  activeClients: number;
  totalAgents: number;
  totalAdmins: number;
  totalCredits: number;
  pendingCredits: number;
  approvedCredits: number;
  rejectedCredits: number;
  totalAmount: number;
  pendingAmount: number;
  approvedAmount: number;
  defaultRate: number;
  averageLoanAmount: number;
}

export interface UserManagement {
  id: number;
  username: string;
  email: string;
  role: 'CLIENT' | 'AGENT' | 'ADMIN';
  phone: string;
  cin: string;
  address: string;
  employed: boolean;
  monthlyIncome: number;
  profession: string;
  creditCount: number;
  totalBorrowedAmount: number;
}

export interface CreditDetails {
  id: number;
  amount: number;
  duration: number;
  interestRate: number;
  purpose: string;
  isFunctionnaire: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  createdAt: string;
  clientUsername: string;
  clientEmail: string;
  clientPhone: string;
  clientCin: string;
  guarantorName?: string;
  guarantorCin?: string;
  guarantorPhone?: string;
  guarantorAddress?: string;
}

export interface SystemSettings {
  id: number;
  defaultInterestRate: number;
  maxLoanAmount: number;
  minLoanAmount: number;
  maxLoanDuration: number;
  minLoanDuration: number;
  systemMaintenance: boolean;
  maintenanceMessage?: string;
}

export interface MonthlyStats {
  month: number;
  year: number;
  creditCount: number;
  totalAmount: number;
}