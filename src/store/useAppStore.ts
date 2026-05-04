import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Member, Transaction, MockData, UserRole } from '@/types';

// Import mock data directly (assuming it's available at build time or fetched)
// In a real app we would fetch this. For now we will load it from the public folder or just hardcode initial state
// Since we can't easily "import" json from public in client components without fetch, 
// we'll fetch it in an initialization effect or just bundle it if moved to src.
// For simplicity, let's assume we fetch it or it's passed in.

interface AppState {
    isInitialized: boolean;
    currentUser: User | null;
    users: User[];
    members: Member[];
    transactions: Transaction[];

    // Actions
    initialize: (data: MockData) => void;
    setCurrentUser: (userId: string) => void;

    // Admin Actions
    addMember: (member: Member) => void;
    updateMember: (id: string, updates: Partial<Member>) => void;
    deleteMember: (id: string) => void;

    // Transaction Actions
    addTransaction: (transaction: Transaction) => void;
    updateTransactionStatus: (id: string, status: Transaction['status']) => void;

    // Super Admin Actions
    addUser: (user: User) => void;
    updateUserStatus: (id: string, status: User['status']) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            isInitialized: false,
            currentUser: null,
            users: [],
            members: [],
            transactions: [],

            initialize: (data) => {
                // Find full user object for current user
                const fullCurrentUser = data.users.find(u => u.id === data.currentUser.id) || null;

                set({
                    isInitialized: true,
                    currentUser: fullCurrentUser,
                    users: data.users,
                    members: data.members,
                    transactions: data.transactions,
                });
            },

            setCurrentUser: (userId) => {
                const { users } = get();
                const user = users.find(u => u.id === userId) || null;
                set({ currentUser: user });
            },

            addMember: (member) => set((state) => ({
                members: [...state.members, member]
            })),

            updateMember: (id, updates) => set((state) => ({
                members: state.members.map(m => m.id === id ? { ...m, ...updates } : m)
            })),

            deleteMember: (id) => set((state) => ({
                members: state.members.filter(m => m.id !== id)
            })),

            addTransaction: (transaction) => set((state) => ({
                transactions: [...state.transactions, transaction]
            })),

            updateTransactionStatus: (id, status) => set((state) => ({
                transactions: state.transactions.map(t => t.id === id ? { ...t, status } : t)
            })),

            addUser: (user) => set((state) => ({
                users: [...state.users, user]
            })),

            updateUserStatus: (id, status) => set((state) => ({
                users: state.users.map(u => u.id === id ? { ...u, status } : u)
            })),
        }),
        {
            name: 'smartmoney-storage',
            partialize: (state) => ({
                // Persist everything for the prototype feel
                currentUser: state.currentUser,
                users: state.users,
                members: state.members,
                transactions: state.transactions,
                isInitialized: state.isInitialized
            }),
        }
    )
);
