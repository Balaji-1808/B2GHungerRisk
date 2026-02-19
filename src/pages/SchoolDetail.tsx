import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import {
    School, ArrowLeft, Brain, TrendingUp, Users, Calendar,
    MapPin, AlertTriangle, Eye, Send, DollarSign, CheckCircle,
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, ReferenceLine,
} from 'recharts';
import { generateForecast, generateRiskFactors } from '../services/mockData';
import { getRiskColor } from '../utils/risk';
import { getSchoolFinancialData, formatCurrency } from '../services/financialData';

const SchoolDetail: React.FC = () => {
    const { schoolId } = useParams<{ schoolId: string }>();
    const { schools } = useAppStore();
    const navigate = useNavigate();
    const [shortageNote, setShortageNote] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const school = useMemo(() => schools.find((s) => s.id === schoolId), [schools, schoolId]);

    if (!school) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gov-400 gap-4">
                <School size={48} />
                <p className="text-sm">School not found</p>
                <button onClick={() => navigate('/district')} className="text-accent-light text-xs cursor-pointer">← Back to District</button>
            </div>
        );
    }

    const forecast = generateForecast(school);
    const riskFactors = generateRiskFactors(school);
    const riskColor = getRiskColor(school.riskScore);
    const financialData = getSchoolFinancialData(schoolId || '', school.district, school.block, school.enrollment);

    return (
        <div className="space-y-6">
            {/* Navigation */}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs text-gov-400 hover:text-accent-light transition-colors cursor-pointer">
                <ArrowLeft size={14} /> Back
            </button>

            {/* School Header */}
            <div className="glass-card p-5 flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gov-50 flex items-center gap-2">
                        <School size={20} className="text-accent-light" />
                        {school.name}
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gov-400">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {school.block}</span>
                        <span className="flex items-center gap-1"><Users size={12} /> Enrollment: {school.enrollment}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> Last Inspection: {school.lastInspection}</span>
                        {school.hostelAttached && <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-[10px]">Hostel Attached</span>}
                    </div>
                </div>

                {/* Risk Gauge */}
                <div className="flex flex-col items-center">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center relative"
                        style={{
                            background: `conic-gradient(${riskColor} ${school.riskScore * 3.6}deg, rgba(51,65,85,0.3) 0deg)`,
                        }}
                    >
                        <div className="w-14 h-14 rounded-full bg-gov-800 flex items-center justify-center">
                            <span className="text-lg font-bold" style={{ color: riskColor }}>{school.riskScore}</span>
                        </div>
                    </div>
                    <span className="text-[10px] text-gov-400 mt-1">Hunger Risk Index</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {/* Metadata Cards */}
                {[
                    { label: 'Current Attendance', value: school.currentAttendance, total: school.enrollment, icon: <Users size={16} /> },
                    { label: 'Meal Uptake', value: school.avgMealUptake, total: school.capacity, icon: <TrendingUp size={16} /> },
                    { label: 'Capacity Util.', value: `${Math.round((school.avgMealUptake / school.capacity) * 100)}%`, icon: <Eye size={16} /> },
                ].map((m) => (
                    <div key={m.label} className="glass-card p-4">
                        <div className="flex items-center gap-2 text-gov-400 mb-2">
                            {m.icon}
                            <span className="text-xs">{m.label}</span>
                        </div>
                        <p className="text-xl font-bold text-gov-50">
                            {m.value}
                            {'total' in m && typeof m.total === 'number' && (
                                <span className="text-sm text-gov-400 font-normal"> / {m.total}</span>
                            )}
                        </p>
                    </div>
                ))}
            </div>

            {/* Financial Data Section */}
            {financialData && (
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-gov-50 mb-4 flex items-center gap-2">
                        <DollarSign size={16} className="text-emerald-400" />
                        Financial Summary (FY {financialData.financialYear})
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign size={16} className="text-blue-400" />
                                <p className="text-xs text-gov-400">Total Allocation</p>
                            </div>
                            <p className="text-xl font-bold text-blue-400">{formatCurrency(financialData.allocationAmount)}</p>
                            <p className="text-[10px] text-gov-500 mt-1">Per student: {formatCurrency(Math.round(financialData.allocationAmount / financialData.enrollment))}</p>
                        </div>
                        <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp size={16} className="text-emerald-400" />
                                <p className="text-xs text-gov-400">Released Amount</p>
                            </div>
                            <p className="text-xl font-bold text-emerald-400">{formatCurrency(financialData.releasedAmount)}</p>
                            <p className="text-[10px] text-emerald-400 mt-1">
                                {((financialData.releasedAmount / financialData.allocationAmount) * 100).toFixed(1)}% of allocation
                            </p>
                        </div>
                        <div className="bg-purple-500/8 border border-purple-500/20 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle size={16} className="text-purple-400" />
                                <p className="text-xs text-gov-400">Utilized Amount</p>
                            </div>
                            <p className="text-xl font-bold text-purple-400">{formatCurrency(financialData.utilizedAmount)}</p>
                            <p className="text-[10px] text-purple-400 mt-1">
                                {((financialData.utilizedAmount / financialData.allocationAmount) * 100).toFixed(1)}% of allocation
                            </p>
                        </div>
                        <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp size={16} className="text-amber-400" />
                                <p className="text-xs text-gov-400">Utilization Efficiency</p>
                            </div>
                            <p className="text-xl font-bold text-amber-400">
                                {((financialData.utilizedAmount / financialData.releasedAmount) * 100).toFixed(1)}%
                            </p>
                            <p className="text-[10px] text-gov-500 mt-1">of released funds</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 7-Day Forecast Chart */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-gov-50 mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-accent-light" />
                    7-Day Demand Forecast with Confidence Band
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={forecast}>
                        <defs>
                            <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(v: string) => v.slice(5)} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                        <Tooltip
                            contentStyle={{ background: '#1a2332', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                            labelStyle={{ color: '#94a3b8' }}
                        />
                        <ReferenceLine y={school.capacity} stroke="#22c55e" strokeDasharray="5 5" label={{ value: 'Capacity', fill: '#22c55e', fontSize: 10 }} />
                        <Area type="monotone" dataKey="upperBound" stroke="transparent" fill="url(#bandGrad)" />
                        <Area type="monotone" dataKey="lowerBound" stroke="transparent" fill="#0c1222" />
                        <Area type="monotone" dataKey="predictedDemand" name="Predicted Demand" stroke="#3b82f6" fill="none" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
                        <Area type="monotone" dataKey="actualDemand" name="Actual Demand" stroke="#f59e0b" fill="none" strokeWidth={2} strokeDasharray="4 4" dot={{ fill: '#f59e0b', r: 3 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Bottom row: AI Explanation + Shortage Form */}
            <div className="grid grid-cols-2 gap-4">
                {/* AI Explanation Panel */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-gov-50 mb-4 flex items-center gap-2">
                        <Brain size={16} className="text-purple-400" />
                        AI Risk Explanation
                    </h3>
                    <p className="text-[11px] text-gov-400 mb-4">
                        Top 5 contributing factors driving the Hunger Risk Index (SHAP-style feature importance)
                    </p>
                    <div className="space-y-3">
                        {riskFactors.map((rf, i) => {
                            const absImpact = Math.abs(rf.impact);
                            const barColor = rf.impact > 0 ? '#ef4444' : '#22c55e';
                            return (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gov-100 font-medium">{rf.factor}</span>
                                        <span className="text-[11px] font-semibold" style={{ color: barColor }}>
                                            {rf.impact > 0 ? '+' : ''}{(rf.impact * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gov-700 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{
                                                width: `${absImpact * 100}%`,
                                                background: `linear-gradient(90deg, ${barColor}40, ${barColor})`,
                                            }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gov-500 mt-0.5">{rf.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Shortage Report Form */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-gov-50 mb-4 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-amber-400" />
                        Report Shortage
                    </h3>
                    {submitted ? (
                        <div className="h-48 flex flex-col items-center justify-center gap-3 text-emerald-400">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">✓</div>
                            <p className="text-sm font-medium">Report submitted successfully</p>
                            <p className="text-xs text-gov-400">Your shortage report has been logged and will trigger an alert.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gov-400 block mb-1">School</label>
                                <input value={school.name} disabled className="w-full bg-gov-700/50 text-gov-300 text-xs px-3 py-2 rounded-lg border border-gov-600" />
                            </div>
                            <div>
                                <label className="text-xs text-gov-400 block mb-1">Shortage Details</label>
                                <textarea
                                    value={shortageNote}
                                    onChange={(e) => setShortageNote(e.target.value)}
                                    placeholder="Describe the shortage (meals affected, date, reason)..."
                                    className="w-full bg-gov-700 text-gov-200 text-xs px-3 py-2 rounded-lg border border-gov-600 focus:border-accent outline-none h-24 resize-none"
                                />
                            </div>
                            <button
                                onClick={() => setSubmitted(true)}
                                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white text-xs font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
                            >
                                <Send size={14} /> Submit Report
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchoolDetail;
