import { create } from 'zustand';
import type { School, Alert, OptimizationResult } from '../types';
import {
    generateSchools,
    generateSchoolsForDistrict,
    generateAlerts,
    generateOptimizationResults,
} from '../services/mockData';

interface AppState {
    schools: School[];
    alerts: Alert[];
    optimizations: OptimizationResult[];
    selectedBlock: string;
    alertDrawerOpen: boolean;
    currentDistrict: string;
    setSelectedBlock: (block: string) => void;
    toggleAlertDrawer: () => void;
    markAlertRead: (id: string) => void;
    updateOptimizationStatus: (id: string, status: 'approved' | 'rejected') => void;
    setDistrict: (district: string) => void;
    init: (district?: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    schools: [],
    alerts: [],
    optimizations: [],
    selectedBlock: 'All',
    alertDrawerOpen: false,
    currentDistrict: 'Kanchipuram',

    setSelectedBlock: (block) => set({ selectedBlock: block }),

    toggleAlertDrawer: () => set((s) => ({ alertDrawerOpen: !s.alertDrawerOpen })),

    markAlertRead: (id) =>
        set((s) => ({
            alerts: s.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)),
        })),

    updateOptimizationStatus: (id, status) =>
        set((s) => ({
            optimizations: s.optimizations.map((o) =>
                o.id === id ? { ...o, status } : o
            ),
        })),

    setDistrict: (district) => {
        const schools = generateSchoolsForDistrict(district);
        set({
            currentDistrict: district,
            schools,
            alerts: generateAlerts(schools),
            optimizations: generateOptimizationResults(schools),
            selectedBlock: 'All',
        });
    },

    init: (district) => {
        if (get().schools.length > 0) return;
        const districtToUse = district || get().currentDistrict;
        const schools = generateSchoolsForDistrict(districtToUse);
        set({
            currentDistrict: districtToUse,
            schools,
            alerts: generateAlerts(schools),
            optimizations: generateOptimizationResults(schools),
        });
    },
}));
