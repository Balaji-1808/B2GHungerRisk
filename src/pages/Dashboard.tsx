import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import {
    School, AlertTriangle, TrendingUp, Activity,
    Users, CalendarClock, ShieldCheck, Zap, Brain,
    DollarSign, TrendingDown, CheckCircle,
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, CartesianGrid, Cell,
} from 'recharts';
import { getRiskColor, getSystemStatus, getSystemStatusColor, formatNumber } from '../utils/risk';
import { generateRiskTrend, generateIntelligenceSummary } from '../services/mockData';
import {
    getSchoolFinancialData,
    getDistrictFinancialSummary,
    calculateBlockSummary,
    formatCurrency,
} from '../services/financialData';

const Dashboard: React.FC = () => {
    const { schools } = useAppStore();
    const { user, userDistrict } = useAuthStore();
    const navigate = useNavigate();

    // Filter schools based on user role
    const filteredSchools = React.useMemo(() => {
        if (!user) return schools;
        
        if (user.role === 'block_officer' && user.block) {
            return schools.filter(s => s.block === user.block);
        }
        
        if (user.role === 'school_admin' && user.schoolId) {
            return schools.filter(s => s.id === user.schoolId);
        }
        
        return schools; // district_officer sees all
    }, [schools, user]);

    const totalSchools = filteredSchools.length;
    const highRiskSchools = filteredSchools.filter((s) => s.riskScore >= 70);
    const avgRisk = totalSchools > 0 ? Math.round(filteredSchools.reduce((sum, s) => sum + s.riskScore, 0) / totalSchools) : 0;
    const cascadeCount = filteredSchools.filter((s) => s.cascadeRisk).length;
    const riskTrend = generateRiskTrend();
    const intel = generateIntelligenceSummary(filteredSchools);
    const systemStatus = getSystemStatus(avgRisk);

    const top10 = [...filteredSchools].sort((a, b) => b.riskScore - a.riskScore).slice(0, 10);

    // Financial data based on role
    const financialData = React.useMemo(() => {
        if (user?.role === 'district_officer') {
            const summary = getDistrictFinancialSummary(userDistrict, schools);
            return summary;
        } else if (user?.role === 'block_officer' && user.block) {
            return calculateBlockSummary(userDistrict, user.block, schools);
        } else if (user?.role === 'school_admin' && user.schoolId) {
            const school = schools.find(s => s.id === user.schoolId);
            if (school) {
                return getSchoolFinancialData(user.schoolId, school.district, school.block, school.enrollment);
            }
        }
        return null;
    }, [user, userDistrict, schools]);

    // Forecast vs Capacity chart data (aggregate by block)
    const blockData = React.useMemo(() => {
        if (user?.role === 'block_officer' && user.block) {
            // For block officer, show only their block
            const blockSchools = filteredSchools;
            return [{
                block: user.block,
                forecastDemand: blockSchools.reduce((s, sc) => s + sc.avgMealUptake, 0),
                capacity: blockSchools.reduce((s, sc) => s + sc.capacity, 0),
            }];
        }
        
        // For district officer, show all blocks
        return ['Thiruvarur', 'Mannargudi', 'Kodavasal', 'Nannilam', 'Valangaiman'].map((block) => {
            const blockSchools = filteredSchools.filter((s) => s.block === block);
            return {
                block,
                forecastDemand: blockSchools.reduce((s, sc) => s + sc.avgMealUptake, 0),
                capacity: blockSchools.reduce((s, sc) => s + sc.capacity, 0),
            };
        });
    }, [filteredSchools, user]);

    const kpiCards = React.useMemo(() => {
        const schoolLabel = user?.role === 'school_admin' ? 'My School' : 
                           user?.role === 'block_officer' ? 'Block Schools' : 'Total Schools';
        
        return [
            { label: schoolLabel, value: totalSchools, icon: <School size={20} />, color: 'from-blue-500 to-blue-600' },
            { label: 'High-Risk Schools', value: highRiskSchools.length, icon: <AlertTriangle size={20} />, color: 'from-red-500 to-red-600' },
            { label: 'Avg Risk Score', value: `${avgRisk}%`, icon: <TrendingUp size={20} />, color: 'from-amber-500 to-orange-600' },
            { label: 'Cascade Alerts', value: cascadeCount, icon: <Activity size={20} />, color: 'from-purple-500 to-purple-600' },
        ];
    }, [totalSchools, highRiskSchools.length, avgRisk, cascadeCount, user?.role]);

    return (
        <div className="space-y-6">
            {/* ── Digital Twin Status Banner ── */}
            <div className={`rounded-xl border px-5 py-3 flex items-center justify-between ${getSystemStatusColor(systemStatus)}`}>
                <div className="flex items-center gap-3">
                    <Brain size={20} />
                    <div>
                        <span className="text-sm font-semibold">
                            {user?.role === 'school_admin' ? 'School Status:' : 
                             user?.role === 'block_officer' ? `${user.block} Block Status:` : 
                             'Digital Twin Status:'}
                        </span>
                        <span className="ml-2 text-sm font-bold">{systemStatus}</span>
                    </div>
                </div>
                <span className="text-xs opacity-80">
                    Monitoring {totalSchools} {totalSchools === 1 ? 'school' : 'schools'} · Last updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>

            {/* ── School Admin Specific View ── */}
            {user?.role === 'school_admin' && filteredSchools.length === 1 && (
                <div className="glass-card p-5 fade-up">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gov-50">{filteredSchools[0].name}</h2>
                            <p className="text-sm text-gov-400">{filteredSchools[0].block} Block, {filteredSchools[0].district}</p>
                        </div>
                        <button
                            onClick={() => navigate(`/school/${filteredSchools[0].id}`)}
                            className="px-4 py-2 bg-accent-light hover:bg-accent text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            View Full Details →
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        <div className="bg-gov-700/30 rounded-lg p-3">
                            <p className="text-xs text-gov-400 mb-1">Enrollment</p>
                            <p className="text-2xl font-bold text-gov-50">{filteredSchools[0].enrollment}</p>
                        </div>
                        <div className="bg-gov-700/30 rounded-lg p-3">
                            <p className="text-xs text-gov-400 mb-1">Current Attendance</p>
                            <p className="text-2xl font-bold text-gov-50">{filteredSchools[0].currentAttendance}</p>
                        </div>
                        <div className="bg-gov-700/30 rounded-lg p-3">
                            <p className="text-xs text-gov-400 mb-1">Meal Capacity</p>
                            <p className="text-2xl font-bold text-gov-50">{filteredSchools[0].capacity}</p>
                        </div>
                        <div className="bg-gov-700/30 rounded-lg p-3">
                            <p className="text-xs text-gov-400 mb-1">Avg Meal Uptake</p>
                            <p className="text-2xl font-bold text-gov-50">{filteredSchools[0].avgMealUptake}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-4 gap-4">
                {kpiCards.map((kpi, i) => (
                    <div key={kpi.label} className={`glass-card p-4 fade-up stagger-${i + 1}`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-gov-400 font-medium">{kpi.label}</span>
                            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white`}>
                                {kpi.icon}
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gov-50">{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* ── Financial Summary ── */}
            {financialData && (
                <div className="glass-card p-5 fade-up stagger-5">
                    <div className="flex items-center gap-2 mb-4">
                        <DollarSign size={18} className="text-emerald-400" />
                        <h3 className="text-sm font-semibold text-gov-50">
                            {user?.role === 'district_officer' ? 'District Financial Summary (FY 2024-25)' :
                             user?.role === 'block_officer' ? `${user.block} Block Financial Summary (FY 2024-25)` :
                             'School Financial Data (FY 2024-25)'}
                        </h3>
                    </div>
                    
                    {user?.role === 'district_officer' && 'totalAllocation' in financialData && (
                        <div className="grid grid-cols-4 gap-4">
                            <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign size={18} className="text-blue-400" />
                                    <p className="text-xs text-gov-400">Total Allocation</p>
                                </div>
                                <p className="text-2xl font-bold text-blue-400">{formatCurrency(financialData.totalAllocation)}</p>
                            </div>
                            <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingDown size={18} className="text-emerald-400" />
                                    <p className="text-xs text-gov-400">Released Amount</p>
                                </div>
                                <p className="text-2xl font-bold text-emerald-400">{formatCurrency(financialData.totalReleased)}</p>
                                <p className="text-xs text-emerald-400 mt-1">{financialData.releasedPercentage.toFixed(1)}% of allocation</p>
                            </div>
                            <div className="bg-purple-500/8 border border-purple-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle size={18} className="text-purple-400" />
                                    <p className="text-xs text-gov-400">Utilized Amount</p>
                                </div>
                                <p className="text-2xl font-bold text-purple-400">{formatCurrency(financialData.totalUtilized)}</p>
                                <p className="text-xs text-purple-400 mt-1">{financialData.utilizedPercentage.toFixed(1)}% of allocation</p>
                            </div>
                            <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp size={18} className="text-amber-400" />
                                    <p className="text-xs text-gov-400">Utilization Rate</p>
                                </div>
                                <p className="text-2xl font-bold text-amber-400">
                                    {((financialData.totalUtilized / financialData.totalReleased) * 100).toFixed(1)}%
                                </p>
                                <p className="text-xs text-amber-400 mt-1">of released funds</p>
                            </div>
                        </div>
                    )}

                    {user?.role === 'block_officer' && financialData && 'schoolCount' in financialData && (
                        <div className="grid grid-cols-5 gap-4">
                            <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <School size={18} className="text-blue-400" />
                                    <p className="text-xs text-gov-400">Schools</p>
                                </div>
                                <p className="text-2xl font-bold text-blue-400">{financialData.schoolCount}</p>
                            </div>
                            <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign size={18} className="text-emerald-400" />
                                    <p className="text-xs text-gov-400">Allocation</p>
                                </div>
                                <p className="text-xl font-bold text-emerald-400">{formatCurrency(financialData.totalAllocation)}</p>
                            </div>
                            <div className="bg-purple-500/8 border border-purple-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingDown size={18} className="text-purple-400" />
                                    <p className="text-xs text-gov-400">Released</p>
                                </div>
                                <p className="text-xl font-bold text-purple-400">{formatCurrency(financialData.totalReleased)}</p>
                                <p className="text-xs text-purple-400 mt-1">{financialData.releasedPercentage.toFixed(1)}%</p>
                            </div>
                            <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle size={18} className="text-amber-400" />
                                    <p className="text-xs text-gov-400">Utilized</p>
                                </div>
                                <p className="text-xl font-bold text-amber-400">{formatCurrency(financialData.totalUtilized)}</p>
                                <p className="text-xs text-amber-400 mt-1">{financialData.utilizedPercentage.toFixed(1)}%</p>
                            </div>
                            <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp size={18} className="text-red-400" />
                                    <p className="text-xs text-gov-400">Efficiency</p>
                                </div>
                                <p className="text-xl font-bold text-red-400">
                                    {((financialData.totalUtilized / financialData.totalReleased) * 100).toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    )}

                    {user?.role === 'school_admin' && 'enrollment' in financialData && (
                        <div className="grid grid-cols-5 gap-4">
                            <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users size={18} className="text-blue-400" />
                                    <p className="text-xs text-gov-400">Enrollment</p>
                                </div>
                                <p className="text-2xl font-bold text-blue-400">{financialData.enrollment}</p>
                            </div>
                            <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign size={18} className="text-emerald-400" />
                                    <p className="text-xs text-gov-400">Allocation</p>
                                </div>
                                <p className="text-xl font-bold text-emerald-400">{formatCurrency(financialData.allocationAmount)}</p>
                            </div>
                            <div className="bg-purple-500/8 border border-purple-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingDown size={18} className="text-purple-400" />
                                    <p className="text-xs text-gov-400">Released</p>
                                </div>
                                <p className="text-xl font-bold text-purple-400">{formatCurrency(financialData.releasedAmount)}</p>
                                <p className="text-xs text-purple-400 mt-1">
                                    {((financialData.releasedAmount / financialData.allocationAmount) * 100).toFixed(1)}%
                                </p>
                            </div>
                            <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle size={18} className="text-amber-400" />
                                    <p className="text-xs text-gov-400">Utilized</p>
                                </div>
                                <p className="text-xl font-bold text-amber-400">{formatCurrency(financialData.utilizedAmount)}</p>
                                <p className="text-xs text-amber-400 mt-1">
                                    {((financialData.utilizedAmount / financialData.allocationAmount) * 100).toFixed(1)}%
                                </p>
                            </div>
                            <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp size={18} className="text-red-400" />
                                    <p className="text-xs text-gov-400">Efficiency</p>
                                </div>
                                <p className="text-xl font-bold text-red-400">
                                    {((financialData.utilizedAmount / financialData.releasedAmount) * 100).toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── System Intelligence Summary ── */}
            <div className="glass-card p-5 fade-up stagger-5">
                <div className="flex items-center gap-2 mb-4">
                    <Zap size={18} className="text-accent-light" />
                    <h3 className="text-sm font-semibold text-gov-50">System Intelligence Summary</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-red-500/8 border border-red-500/20 rounded-xl p-4 text-center">
                        <Users size={22} className="text-red-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-red-400">{formatNumber(intel.projectedChildrenAtRisk)}</p>
                        <p className="text-xs text-gov-400 mt-1">Projected Children at Risk (7 days)</p>
                    </div>
                    <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4 text-center">
                        <CalendarClock size={22} className="text-amber-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-amber-400">{intel.estimatedShortageDays}</p>
                        <p className="text-xs text-gov-400 mt-1">Estimated Shortage Days</p>
                    </div>
                    <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4 text-center">
                        <ShieldCheck size={22} className="text-emerald-400 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-emerald-400">{intel.potentialRiskReduction}%</p>
                        <p className="text-xs text-gov-400 mt-1">Risk Reduction if Optimized</p>
                    </div>
                </div>
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-2 gap-4">
                {/* 30-day Risk Trend */}
                <div className="glass-card p-5 fade-up stagger-5">
                    <h3 className="text-sm font-semibold text-gov-50 mb-4">
                        {user?.role === 'school_admin' ? 'School Risk Trend (30 Days)' : '30-Day Risk Trend'}
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={riskTrend}>
                            <defs>
                                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="countGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(v: string) => v.slice(5)} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                            <Tooltip
                                contentStyle={{ background: '#1a2332', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                                labelStyle={{ color: '#94a3b8' }}
                            />
                            <Area type="monotone" dataKey="avgRisk" name="Avg Risk %" stroke="#f59e0b" fill="url(#riskGrad)" strokeWidth={2} />
                            <Area type="monotone" dataKey="highRiskCount" name="High-Risk Schools" stroke="#ef4444" fill="url(#countGrad)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Forecast vs Capacity */}
                <div className="glass-card p-5 fade-up stagger-6">
                    <h3 className="text-sm font-semibold text-gov-50 mb-4">
                        {user?.role === 'school_admin' ? 'School Demand vs Capacity' :
                         user?.role === 'block_officer' ? `${user.block} Block - Demand vs Capacity` :
                         'Forecast Demand vs Capacity (by Block)'}
                    </h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={blockData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="block" tick={{ fill: '#64748b', fontSize: 10 }} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                            <Tooltip
                                contentStyle={{ background: '#1a2332', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                                labelStyle={{ color: '#94a3b8' }}
                            />
                            <Bar dataKey="forecastDemand" name="Forecast Demand" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="capacity" name="Capacity" fill="#22c55e" radius={[4, 4, 0, 0]} opacity={0.6} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Top 10 High-Risk Schools ── */}
            <div className="glass-card p-5 fade-up">
                <h3 className="text-sm font-semibold text-gov-50 mb-4">
                    {user?.role === 'school_admin' ? 'School Details' :
                     user?.role === 'block_officer' ? `High-Risk Schools in ${user.block}` :
                     'Top 10 High-Risk Schools'}
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-gov-400 border-b border-gov-600">
                                <th className="text-left py-2 px-3 font-medium">School</th>
                                <th className="text-left py-2 px-3 font-medium">Block</th>
                                <th className="text-center py-2 px-3 font-medium">Enrollment</th>
                                <th className="text-center py-2 px-3 font-medium">Capacity</th>
                                <th className="text-center py-2 px-3 font-medium">Risk Score</th>
                                <th className="text-center py-2 px-3 font-medium">Cascade</th>
                                <th className="text-right py-2 px-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {top10.map((s) => (
                                <tr key={s.id} className="text-xs border-b border-gov-700/50 hover:bg-gov-700/30 transition-colors">
                                    <td className="py-2.5 px-3 text-gov-100 font-medium">{s.name}</td>
                                    <td className="py-2.5 px-3 text-gov-300">{s.block}</td>
                                    <td className="py-2.5 px-3 text-center text-gov-200">{s.enrollment}</td>
                                    <td className="py-2.5 px-3 text-center text-gov-200">{s.capacity}</td>
                                    <td className="py-2.5 px-3 text-center">
                                        <span
                                            className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold"
                                            style={{ background: `${getRiskColor(s.riskScore)}20`, color: getRiskColor(s.riskScore) }}
                                        >
                                            {s.riskScore}%
                                        </span>
                                    </td>
                                    <td className="py-2.5 px-3 text-center">
                                        {s.cascadeRisk && <AlertTriangle size={14} className="text-amber-400 mx-auto" />}
                                    </td>
                                    <td className="py-2.5 px-3 text-right">
                                        <button
                                            onClick={() => navigate(`/school/${s.id}`)}
                                            className="text-accent-light hover:text-accent text-[11px] font-medium cursor-pointer"
                                        >
                                            View →
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
