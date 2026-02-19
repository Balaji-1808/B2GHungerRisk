import type { SystemStatus } from '../types';

export const RISK_COLORS = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#ef4444',
} as const;

export const getRiskColor = (score: number): string => {
    if (score >= 70) return RISK_COLORS.high;
    if (score >= 40) return RISK_COLORS.medium;
    return RISK_COLORS.low;
};

export const getRiskLevel = (score: number): 'low' | 'medium' | 'high' => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
};

export const getRiskBg = (score: number): string => {
    if (score >= 70) return 'bg-red-500/10 border-red-500/30';
    if (score >= 40) return 'bg-amber-500/10 border-amber-500/30';
    return 'bg-emerald-500/10 border-emerald-500/30';
};

export const getSystemStatus = (avgRisk: number): SystemStatus => {
    if (avgRisk >= 60) return 'Critical';
    if (avgRisk >= 35) return 'Elevated Risk';
    return 'Stable';
};

export const getSystemStatusColor = (status: SystemStatus): string => {
    switch (status) {
        case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/40';
        case 'Elevated Risk': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
        case 'Stable': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
};

export const getStressColor = (stress: string): string => {
    switch (stress) {
        case 'critical': return 'text-red-400';
        case 'high': return 'text-orange-400';
        case 'moderate': return 'text-amber-400';
        default: return 'text-emerald-400';
    }
};

export const formatNumber = (n: number): string =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();

export const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));
