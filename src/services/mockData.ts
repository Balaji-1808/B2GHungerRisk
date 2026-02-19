import type {
    School, ForecastDay, OptimizationResult, Alert,
    RiskFactor, IntelligenceSummary
} from '../types';
import { getRiskLevel } from '../utils/risk';
import { DISTRICTS, SCHOOLS_DATABASE, type District } from './districts';

// ── Deterministic seed-like random ───────────────────────────
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// ── Legacy exports for backward compatibility ────────────────
export const BLOCKS = DISTRICTS[0].blocks; // Default to first district
export const DISTRICT = DISTRICTS[0].name;

// ── Generate Schools for a specific district using database ──
export const generateSchoolsForDistrict = (districtName: string): School[] => {
    const district = DISTRICTS.find(d => d.name === districtName);
    if (!district) return [];

    // Get schools from database for this district
    const dbSchools = SCHOOLS_DATABASE.filter(s => s.district === districtName);
    
    // Generate additional schools for each block to have 4-5 schools minimum
    const schools: School[] = [];
    const schoolPrefixes = ['GHS', 'GHSS', 'GMS', 'PUMS', 'ADW'];
    const schoolSuffixes = ['Boys', 'Girls', 'East', 'West', 'South'];

    district.blocks.forEach((block, blockIndex) => {
        // Get existing schools from database for this block
        const blockDbSchools = dbSchools.filter(s => s.block === block);
        
        // Add database schools first
        blockDbSchools.forEach((dbSchool, idx) => {
            const seed = (district.code * 1000) + (blockIndex * 100) + idx;
            const enrollment = Math.floor(150 + seededRandom(seed + 1) * 350);
            const capacity = Math.floor(enrollment * (0.85 + seededRandom(seed + 2) * 0.35));
            const attendance = Math.floor(enrollment * (0.65 + seededRandom(seed + 3) * 0.3));
            const riskScore = Math.floor(seededRandom(seed + 4) * 100);

            schools.push({
                id: dbSchool.udiseCode,
                name: dbSchool.name,
                block: dbSchool.block,
                district: districtName,
                enrollment,
                capacity,
                currentAttendance: attendance,
                avgMealUptake: Math.floor(attendance * (0.85 + seededRandom(seed + 5) * 0.15)),
                riskScore,
                riskLevel: getRiskLevel(riskScore),
                cascadeRisk: riskScore > 65 && seededRandom(seed + 6) > 0.4,
                lat: 10.77 + seededRandom(seed + 7) * 0.15,
                lng: 79.63 + seededRandom(seed + 8) * 0.15,
                hostelAttached: seededRandom(seed + 9) > 0.7,
                lastInspection: `2026-0${1 + Math.floor(seededRandom(seed + 10) * 2)}-${String(1 + Math.floor(seededRandom(seed + 11) * 28)).padStart(2, '0')}`,
                shortageReported: riskScore > 60 && seededRandom(seed + 12) > 0.5,
            });
        });

        // Add 2-3 more generated schools per block to ensure we have 4-5 schools
        const additionalSchools = Math.max(0, 4 - blockDbSchools.length);
        for (let i = 0; i < additionalSchools; i++) {
            const seed = (district.code * 1000) + (blockIndex * 100) + blockDbSchools.length + i + 100;
            const prefix = schoolPrefixes[Math.floor(seededRandom(seed) * schoolPrefixes.length)];
            const suffix = schoolSuffixes[i % schoolSuffixes.length];
            const name = `${prefix} ${block} ${suffix}`;
            
            const enrollment = Math.floor(150 + seededRandom(seed + 1) * 350);
            const capacity = Math.floor(enrollment * (0.85 + seededRandom(seed + 2) * 0.35));
            const attendance = Math.floor(enrollment * (0.65 + seededRandom(seed + 3) * 0.3));
            const riskScore = Math.floor(seededRandom(seed + 4) * 100);

            schools.push({
                id: `SCH-${district.code}-${String(blockIndex + 1).padStart(2, '0')}-${String(blockDbSchools.length + i + 1).padStart(3, '0')}`,
                name,
                block,
                district: districtName,
                enrollment,
                capacity,
                currentAttendance: attendance,
                avgMealUptake: Math.floor(attendance * (0.85 + seededRandom(seed + 5) * 0.15)),
                riskScore,
                riskLevel: getRiskLevel(riskScore),
                cascadeRisk: riskScore > 65 && seededRandom(seed + 6) > 0.4,
                lat: 10.77 + seededRandom(seed + 7) * 0.15,
                lng: 79.63 + seededRandom(seed + 8) * 0.15,
                hostelAttached: seededRandom(seed + 9) > 0.7,
                lastInspection: `2026-0${1 + Math.floor(seededRandom(seed + 10) * 2)}-${String(1 + Math.floor(seededRandom(seed + 11) * 28)).padStart(2, '0')}`,
                shortageReported: riskScore > 60 && seededRandom(seed + 12) > 0.5,
            });
        }
    });

    return schools;
};

// ── Generate Schools (default to first district) ─────────────
export const generateSchools = (): School[] => {
    return generateSchoolsForDistrict(DISTRICTS[0].name);
};

// ── Generate 7-day Forecast ──────────────────────────────────
export const generateForecast = (school: School): ForecastDay[] => {
    const base = school.avgMealUptake;
    const today = new Date();

    return Array.from({ length: 7 }, (_, i) => {
        const seed = parseInt(school.id.replace('SCH-', '')) * 100 + i;
        const variation = seededRandom(seed) * 0.3 - 0.15;
        const predicted = Math.floor(base * (1 + variation));
        const band = Math.floor(predicted * 0.12);

        const date = new Date(today);
        date.setDate(date.getDate() + i);

        return {
            date: date.toISOString().split('T')[0],
            predictedDemand: predicted,
            lowerBound: predicted - band,
            upperBound: predicted + band,
            capacity: school.capacity,
            actualDemand: i < 2 ? Math.floor(predicted * (0.9 + seededRandom(seed + 50) * 0.2)) : undefined,
            riskScore: Math.floor(school.riskScore + (seededRandom(seed + 60) * 20 - 10)),
        };
    });
};

// ── Generate 30-day Risk Trend ───────────────────────────────
export const generateRiskTrend = (): { date: string; avgRisk: number; highRiskCount: number }[] => {
    const today = new Date();
    return Array.from({ length: 30 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (29 - i));
        const seed = i * 7 + 99;
        return {
            date: date.toISOString().split('T')[0],
            avgRisk: Math.floor(30 + seededRandom(seed) * 35),
            highRiskCount: Math.floor(3 + seededRandom(seed + 1) * 12),
        };
    });
};

// ── Generate Risk Factors (SHAP-style) ───────────────────────
export const generateRiskFactors = (school: School): RiskFactor[] => {
    const factorPool: RiskFactor[] = [
        { factor: 'Attendance Drop', impact: 0.82, description: '15% decline in past week attendance pattern' },
        { factor: 'Seasonal Weather', impact: 0.65, description: 'Monsoon forecast — likely transport disruptions' },
        { factor: 'Previous Shortage', impact: 0.58, description: 'Reported meal shortage in last 14 days' },
        { factor: 'Exam Schedule', impact: -0.35, description: 'Mid-term exams — expected lower attendance' },
        { factor: 'Festival Period', impact: 0.72, description: 'Regional Pongal celebrations impacting routine' },
        { factor: 'Supply Chain Delay', impact: 0.48, description: 'Rice delivery delayed by 3 days at block depot' },
        { factor: 'Enrollment Surge', impact: 0.42, description: 'New admissions exceeded projected capacity' },
        { factor: 'Budget Exhaustion', impact: 0.91, description: 'Block budget utilization at 94% with 2 months remaining' },
        { factor: 'Transport Disruption', impact: 0.55, description: 'Road repairs blocking primary supply route' },
        { factor: 'Hostel Demand Spike', impact: 0.38, description: 'Increased hostel occupancy during exam period' },
    ];

    const seed = parseInt(school.id.replace('SCH-', ''));
    const shuffled = [...factorPool].sort((a, b) => seededRandom(seed + a.impact * 100) - seededRandom(seed + b.impact * 100));
    return shuffled.slice(0, 5).sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
};

// ── Generate Optimization Results ────────────────────────────
export const generateOptimizationResults = (schools: School[]): OptimizationResult[] => {
    const highRiskSchools = schools.filter(s => s.riskScore > 50);
    return highRiskSchools.slice(0, 15).map((school, i) => {
        const seed = parseInt(school.id.replace('SCH-', '')) + 200;
        const currentAlloc = school.capacity;
        const extraNeeded = Math.floor(seededRandom(seed) * 40 + 10);

        return {
            id: `OPT-${String(i + 1).padStart(3, '0')}`,
            schoolId: school.id,
            schoolName: school.name,
            block: school.block,
            currentAllocation: currentAlloc,
            recommendedAllocation: currentAlloc + extraNeeded,
            riskBefore: school.riskScore,
            riskAfter: Math.max(15, school.riskScore - Math.floor(seededRandom(seed + 1) * 35 + 10)),
            childrenImpacted: Math.floor(seededRandom(seed + 2) * 80 + 20),
            status: 'pending',
            reason: [
                'Attendance surge predicted',
                'Cascade risk from adjacent block',
                'Weather-driven demand increase',
                'Budget reallocation opportunity',
                'Supply chain optimization',
            ][i % 5],
        };
    });
};

// ── Generate Alerts ──────────────────────────────────────────
export const generateAlerts = (schools: School[]): Alert[] => {
    const alerts: Alert[] = [];
    const now = new Date();

    schools.filter(s => s.riskScore >= 70).forEach((s, i) => {
        alerts.push({
            id: `ALT-HR-${i}`,
            title: `High Risk: ${s.name}`,
            message: `Risk score at ${s.riskScore}%. Immediate attention required. Predicted shortfall of ${Math.floor(s.enrollment * 0.15)} meals.`,
            severity: 'critical',
            category: 'high_risk',
            schoolId: s.id,
            schoolName: s.name,
            block: s.block,
            timestamp: new Date(now.getTime() - i * 3600000).toISOString(),
            read: false,
        });
    });

    schools.filter(s => s.cascadeRisk).forEach((s, i) => {
        alerts.push({
            id: `ALT-CC-${i}`,
            title: `Cascade Warning: ${s.block}`,
            message: `${s.name} risk may cascade to 3 nearby schools. Block-level intervention recommended.`,
            severity: 'warning',
            category: 'cascade',
            schoolId: s.id,
            schoolName: s.name,
            block: s.block,
            timestamp: new Date(now.getTime() - (i + 5) * 3600000).toISOString(),
            read: false,
        });
    });

    schools.filter(s => s.lastInspection < '2026-01-15').slice(0, 5).forEach((s, i) => {
        alerts.push({
            id: `ALT-INS-${i}`,
            title: `Inspection Overdue: ${s.name}`,
            message: `Last inspection on ${s.lastInspection}. Schedule priority inspection.`,
            severity: 'info',
            category: 'inspection',
            schoolId: s.id,
            schoolName: s.name,
            block: s.block,
            timestamp: new Date(now.getTime() - (i + 10) * 3600000).toISOString(),
            read: false,
        });
    });

    return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// ── Intelligence Summary ─────────────────────────────────────
export const generateIntelligenceSummary = (schools: School[]): IntelligenceSummary => {
    const highRisk = schools.filter(s => s.riskScore >= 60);
    return {
        projectedChildrenAtRisk: highRisk.reduce((sum, s) => sum + Math.floor(s.enrollment * 0.2), 0),
        estimatedShortageDays: highRisk.reduce((sum, s) => sum + Math.floor(s.riskScore / 25), 0),
        potentialRiskReduction: 34,
    };
};
