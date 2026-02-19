// Financial Data for Schools - 2024-25

export interface SchoolFinancialData {
    district: string;
    block: string;
    schoolUDISE: string;
    enrollment: number;
    allocationAmount: number;
    releasedAmount: number;
    utilizedAmount: number;
    financialYear: string;
}

export interface DistrictFinancialSummary {
    district: string;
    totalAllocation: number;
    totalReleased: number;
    totalUtilized: number;
    releasedPercentage: number;
    utilizedPercentage: number;
}

// ── Financial Allocation Formula ──
// Based on Tamil Nadu Mid-Day Meal Scheme norms:
// - Primary (1-5): ₹5.45 per child per day
// - Upper Primary (6-8): ₹8.17 per child per day
// - Average: ₹6.80 per child per day
// - Working days: ~220 days per year
// - Base allocation: enrollment × ₹6.80 × 220 = enrollment × ₹1,496 per year

const COST_PER_CHILD_PER_DAY = 6.80; // Average cost in rupees
const WORKING_DAYS_PER_YEAR = 220;
const BASE_ALLOCATION_PER_CHILD = COST_PER_CHILD_PER_DAY * WORKING_DAYS_PER_YEAR; // ₹1,496

// Seeded random for consistent generation
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// Generate financial data for a school based on enrollment
export const generateSchoolFinancialData = (
    schoolId: string,
    district: string,
    block: string,
    enrollment: number
): SchoolFinancialData => {
    const seed = parseInt(schoolId.replace(/\D/g, '')) || 1000;
    
    // Base allocation
    const baseAllocation = Math.round(enrollment * BASE_ALLOCATION_PER_CHILD);
    
    // Add variation (±5%) for realistic data
    const allocationVariation = 1 + (seededRandom(seed) * 0.1 - 0.05);
    const allocationAmount = Math.round(baseAllocation * allocationVariation);
    
    // Released amount: typically 93-97% of allocation
    const releasedPercentage = 0.93 + seededRandom(seed + 1) * 0.04;
    const releasedAmount = Math.round(allocationAmount * releasedPercentage);
    
    // Utilized amount: typically 96-100% of released amount
    const utilizedPercentage = 0.96 + seededRandom(seed + 2) * 0.04;
    const utilizedAmount = Math.round(releasedAmount * utilizedPercentage);
    
    return {
        district,
        block,
        schoolUDISE: schoolId,
        enrollment,
        allocationAmount,
        releasedAmount,
        utilizedAmount,
        financialYear: "2024-25"
    };
};

// Static data for specific schools (from user's original data)
export const STATIC_SCHOOL_FINANCIAL_DATA: SchoolFinancialData[] = [
    // Kanchipuram District
    { district: "Kanchipuram", block: "Sriperumbudur", schoolUDISE: "33120100101", enrollment: 420, allocationAmount: 567000, releasedAmount: 540000, utilizedAmount: 555000, financialYear: "2024-25" },
    { district: "Kanchipuram", block: "Sriperumbudur", schoolUDISE: "33120100202", enrollment: 580, allocationAmount: 783000, releasedAmount: 745000, utilizedAmount: 765000, financialYear: "2024-25" },
    { district: "Kanchipuram", block: "Uthiramerur", schoolUDISE: "33120200103", enrollment: 360, allocationAmount: 486000, releasedAmount: 465000, utilizedAmount: 475000, financialYear: "2024-25" },
    { district: "Kanchipuram", block: "Uthiramerur", schoolUDISE: "33120200204", enrollment: 650, allocationAmount: 878000, releasedAmount: 835000, utilizedAmount: 855000, financialYear: "2024-25" },
    { district: "Kanchipuram", block: "Kanchipuram", schoolUDISE: "33120100305", enrollment: 510, allocationAmount: 689000, releasedAmount: 655000, utilizedAmount: 670000, financialYear: "2024-25" },
    
    // Tiruvallur District
    { district: "Tiruvallur", block: "Poonamallee", schoolUDISE: "33110200106", enrollment: 470, allocationAmount: 635000, releasedAmount: 605000, utilizedAmount: 620000, financialYear: "2024-25" },
    { district: "Tiruvallur", block: "Poonamallee", schoolUDISE: "33110200207", enrollment: 390, allocationAmount: 527000, releasedAmount: 500000, utilizedAmount: 515000, financialYear: "2024-25" },
    { district: "Tiruvallur", block: "Tiruvallur", schoolUDISE: "33110100108", enrollment: 610, allocationAmount: 824000, releasedAmount: 785000, utilizedAmount: 805000, financialYear: "2024-25" },
    { district: "Tiruvallur", block: "Tiruvallur", schoolUDISE: "33110100209", enrollment: 440, allocationAmount: 595000, releasedAmount: 565000, utilizedAmount: 580000, financialYear: "2024-25" },
    { district: "Tiruvallur", block: "Gummidipoondi", schoolUDISE: "33110300110", enrollment: 520, allocationAmount: 702000, releasedAmount: 670000, utilizedAmount: 685000, financialYear: "2024-25" },
    
    // Cuddalore District
    { district: "Cuddalore", block: "Cuddalore", schoolUDISE: "33210100111", enrollment: 480, allocationAmount: 648000, releasedAmount: 620000, utilizedAmount: 635000, financialYear: "2024-25" },
    { district: "Cuddalore", block: "Cuddalore", schoolUDISE: "33210100212", enrollment: 350, allocationAmount: 473000, releasedAmount: 450000, utilizedAmount: 460000, financialYear: "2024-25" },
    { district: "Cuddalore", block: "Panruti", schoolUDISE: "33210400113", enrollment: 620, allocationAmount: 837000, releasedAmount: 800000, utilizedAmount: 820000, financialYear: "2024-25" },
    { district: "Cuddalore", block: "Panruti", schoolUDISE: "33210400214", enrollment: 410, allocationAmount: 554000, releasedAmount: 525000, utilizedAmount: 540000, financialYear: "2024-25" },
    { district: "Cuddalore", block: "Kurinjipadi", schoolUDISE: "33210200115", enrollment: 590, allocationAmount: 797000, releasedAmount: 760000, utilizedAmount: 780000, financialYear: "2024-25" },
    
    // Villupuram District
    { district: "Villupuram", block: "Villupuram", schoolUDISE: "33220100116", enrollment: 380, allocationAmount: 513000, releasedAmount: 490000, utilizedAmount: 500000, financialYear: "2024-25" },
    { district: "Villupuram", block: "Villupuram", schoolUDISE: "33220100217", enrollment: 720, allocationAmount: 973000, releasedAmount: 940000, utilizedAmount: 960000, financialYear: "2024-25" },
    { district: "Villupuram", block: "Tindivanam", schoolUDISE: "33220200118", enrollment: 450, allocationAmount: 608000, releasedAmount: 580000, utilizedAmount: 595000, financialYear: "2024-25" },
    { district: "Villupuram", block: "Tindivanam", schoolUDISE: "33220200219", enrollment: 530, allocationAmount: 716000, releasedAmount: 680000, utilizedAmount: 700000, financialYear: "2024-25" },
    { district: "Villupuram", block: "Gingee", schoolUDISE: "33220300120", enrollment: 370, allocationAmount: 500000, releasedAmount: 475000, utilizedAmount: 490000, financialYear: "2024-25" },
];

// Cache for generated financial data
const financialDataCache = new Map<string, SchoolFinancialData>();

// Helper functions
export const getSchoolFinancialData = (udiseCode: string, district?: string, block?: string, enrollment?: number): SchoolFinancialData | undefined => {
    // Check static data first
    const staticData = STATIC_SCHOOL_FINANCIAL_DATA.find(s => s.schoolUDISE === udiseCode);
    if (staticData) return staticData;
    
    // Check cache
    if (financialDataCache.has(udiseCode)) {
        return financialDataCache.get(udiseCode);
    }
    
    // Generate if we have the required data
    if (district && block && enrollment) {
        const generated = generateSchoolFinancialData(udiseCode, district, block, enrollment);
        financialDataCache.set(udiseCode, generated);
        return generated;
    }
    
    return undefined;
};

export const getDistrictFinancialSummary = (districtName: string, schools?: Array<{id: string, district: string, block: string, enrollment: number}>): DistrictFinancialSummary => {
    let allSchoolsData: SchoolFinancialData[] = [];
    
    if (schools) {
        // Generate financial data for all schools in the district
        allSchoolsData = schools
            .filter(s => s.district === districtName)
            .map(s => getSchoolFinancialData(s.id, s.district, s.block, s.enrollment))
            .filter((data): data is SchoolFinancialData => data !== undefined);
    } else {
        // Use static data only
        allSchoolsData = STATIC_SCHOOL_FINANCIAL_DATA.filter(s => s.district === districtName);
    }
    
    const totalAllocation = allSchoolsData.reduce((sum, s) => sum + s.allocationAmount, 0);
    const totalReleased = allSchoolsData.reduce((sum, s) => sum + s.releasedAmount, 0);
    const totalUtilized = allSchoolsData.reduce((sum, s) => sum + s.utilizedAmount, 0);
    
    return {
        district: districtName,
        totalAllocation,
        totalReleased,
        totalUtilized,
        releasedPercentage: totalAllocation > 0 ? (totalReleased / totalAllocation) * 100 : 0,
        utilizedPercentage: totalAllocation > 0 ? (totalUtilized / totalAllocation) * 100 : 0
    };
};

export const getBlockFinancialData = (districtName: string, blockName: string, schools?: Array<{id: string, district: string, block: string, enrollment: number}>): SchoolFinancialData[] => {
    if (schools) {
        // Generate financial data for all schools in the block
        return schools
            .filter(s => s.district === districtName && s.block === blockName)
            .map(s => getSchoolFinancialData(s.id, s.district, s.block, s.enrollment))
            .filter((data): data is SchoolFinancialData => data !== undefined);
    }
    
    // Use static data only
    return STATIC_SCHOOL_FINANCIAL_DATA.filter(s => s.district === districtName && s.block === blockName);
};

export const calculateBlockSummary = (districtName: string, blockName: string, schools?: Array<{id: string, district: string, block: string, enrollment: number}>) => {
    const blockData = getBlockFinancialData(districtName, blockName, schools);
    
    if (blockData.length === 0) return null;
    
    const totalAllocation = blockData.reduce((sum, s) => sum + s.allocationAmount, 0);
    const totalReleased = blockData.reduce((sum, s) => sum + s.releasedAmount, 0);
    const totalUtilized = blockData.reduce((sum, s) => sum + s.utilizedAmount, 0);
    
    return {
        schoolCount: blockData.length,
        totalAllocation,
        totalReleased,
        totalUtilized,
        releasedPercentage: totalAllocation > 0 ? (totalReleased / totalAllocation) * 100 : 0,
        utilizedPercentage: totalAllocation > 0 ? (totalUtilized / totalAllocation) * 100 : 0
    };
};

export const formatCurrency = (amount: number): string => {
    if (amount >= 10000000) {
        return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(2)} Lakh`;
    } else if (amount >= 1000) {
        return `₹${(amount / 1000).toFixed(2)}K`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
};
