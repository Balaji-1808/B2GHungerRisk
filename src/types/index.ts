// ── User & Auth ──────────────────────────────────────────────
export type UserRole = 'district_officer' | 'block_officer' | 'school_admin';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    block?: string;
    schoolId?: string;
}

// ── School ───────────────────────────────────────────────────
export interface School {
    id: string;
    name: string;
    block: string;
    district: string;
    enrollment: number;
    capacity: number;
    currentAttendance: number;
    avgMealUptake: number;
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    cascadeRisk: boolean;
    lat: number;
    lng: number;
    hostelAttached: boolean;
    lastInspection: string;
    shortageReported: boolean;
}

// ── Forecast ─────────────────────────────────────────────────
export interface ForecastDay {
    date: string;
    predictedDemand: number;
    lowerBound: number;
    upperBound: number;
    capacity: number;
    actualDemand?: number;
    riskScore: number;
}

// ── Optimization ─────────────────────────────────────────────
export interface OptimizationResult {
    id: string;
    schoolId: string;
    schoolName: string;
    block: string;
    currentAllocation: number;
    recommendedAllocation: number;
    riskBefore: number;
    riskAfter: number;
    childrenImpacted: number;
    status: 'pending' | 'approved' | 'rejected';
    reason: string;
}

// ── Simulation ───────────────────────────────────────────────
export interface SimulationState {
    capacityModifier: number;      // -50 to +50 (%)
    budgetModifier: number;        // -30 to +30 (%)
    weatherDisruption: boolean;
    transportDisruption: boolean;
    resultRiskChange: number;      // % change in avg risk
    stabilityIndex: number;        // 0–100
    systemStress: 'low' | 'moderate' | 'high' | 'critical';
    affectedSchools: number;
    projectedShortages: number;
}

// ── Alert ────────────────────────────────────────────────────
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertCategory = 'high_risk' | 'cascade' | 'inspection' | 'shortage' | 'system';

export interface Alert {
    id: string;
    title: string;
    message: string;
    severity: AlertSeverity;
    category: AlertCategory;
    schoolId?: string;
    schoolName?: string;
    block?: string;
    timestamp: string;
    read: boolean;
}

// ── Risk Factor (SHAP-style) ─────────────────────────────────
export interface RiskFactor {
    factor: string;
    impact: number;       // -1 to +1
    description: string;
}

// ── System Status (Digital Twin) ─────────────────────────────
export type SystemStatus = 'Stable' | 'Elevated Risk' | 'Critical';

// ── Intelligence Summary ─────────────────────────────────────
export interface IntelligenceSummary {
    projectedChildrenAtRisk: number;
    estimatedShortageDays: number;
    potentialRiskReduction: number;   // % if optimization applied
}
