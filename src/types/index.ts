export type UserRole = 'SUPER_ADMIN' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type MemberStatus = 'ACTIVE' | 'PENDING_APPROVAL' | 'OVERDUE' | 'CLOSED';
export type LoanInterestType = 'DAILY' | 'MONTHLY' | 'FIXED' | 'YEARLY';
export type TransactionType = 'PAYMENT' | 'WITHDRAWAL';
export type TransactionStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export interface User {
    id: string;
    username: string;
    name: string;
    role: UserRole;
    status: UserStatus;
    avatar?: string;
    plan?: 'BASIC' | 'PREMIUM'; // For Admins
}

export interface Member {
    id: string;
    adminId: string; // Belongs to which Admin
    name: string;
    phone: string;
    loanAmount: number;
    interestRate: number;
    interestType: LoanInterestType;
    totalInstallments: number;
    paidInstallments: number;
    status: MemberStatus;
    loanDate: string; // ISO Date
}

export interface Transaction {
    id: string;
    memberId: string;
    adminId: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    slipUrl?: string;
    createdAt: string; // ISO Date
    note?: string;
}

export interface MockData {
    currentUser: {
        id: string;
        role: UserRole;
    };
    users: User[];
    members: Member[];
    transactions: Transaction[];
}
