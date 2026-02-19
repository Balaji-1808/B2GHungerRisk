import { create } from 'zustand';
import type { User, UserRole } from '../types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    userDistrict: string;
    login: (role: UserRole, profileData?: any) => void;
    logout: () => void;
}

const roleProfiles: Record<UserRole, Omit<User, 'role'>> = {
    district_officer: { id: 'DO-001', name: 'Dr. S. Ramanathan' },
    block_officer: { id: 'BO-001', name: 'K. Priya', block: 'Kanchipuram' },
    school_admin: { id: 'SA-001', name: 'R. Venkatesh', schoolId: 'SCH-001', block: 'Kanchipuram' },
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    userDistrict: 'Kanchipuram',
    login: (role, profileData) => {
        // If profileData is provided (from registration), use it
        if (profileData) {
            set({
                user: {
                    id: profileData.employeeId || profileData.udiseCode || 'USER-001',
                    name: profileData.fullName,
                    role,
                    block: profileData.block,
                    schoolId: profileData.udiseCode,
                },
                isAuthenticated: true,
                userDistrict: profileData.district || 'Kanchipuram',
            });
        } else {
            // Use default profile
            set({
                user: { ...roleProfiles[role], role },
                isAuthenticated: true,
                userDistrict: 'Kanchipuram',
            });
        }
    },
    logout: () =>
        set({ user: null, isAuthenticated: false, userDistrict: 'Kanchipuram' }),
}));
