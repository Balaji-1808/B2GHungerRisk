import React, { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import {
    Cpu, TrendingDown, Users, CheckCircle2, XCircle,
    ArrowRight, ShieldCheck, AlertTriangle, BarChart3,
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, Cell,
} from 'recharts';
import { getRiskColor } from '../utils/risk';

const OptimizationCenter: React.FC = () => {
    const { optimizations, updateOptimizationStatus } = useAppStore();

    // Summary stats
    const summary = useMemo(() => {
        const pending = optimizations.filter((o) => o.status === 'pending');
        const approved = optimizations.filter((o) => o.status === 'approved');
        const totalChildrenImpacted = optimizations.reduce((s, o) => s + o.childrenImpacted, 0);
        const avgRiskBefore = Math.round(optimizations.reduce((s, o) => s + o.riskBefore, 0) / optimizations.length);
        const avgRiskAfter = Math.round(optimizations.reduce((s, o) => s + o.riskAfter, 0) / optimizations.length);
        const totalRiskReduction = avgRiskBefore - avgRiskAfter;

        return { pending: pending.length, approved: approved.length, totalChildrenImpacted, avgRiskBefore, avgRiskAfter, totalRiskReduction };
    }, [optimizations]);

    // Before vs After chart data
    const comparisonData = useMemo(() =>
        optimizations.slice(0, 10).map((o) => ({
            school: o.schoolName.split(' ').slice(0, 2).join(' '),
            riskBefore: o.riskBefore,
            riskAfter: o.riskAfter,
        })),
        [optimizations]
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Cpu size={22} className="text-accent-light" />
                <div>
                    <h2 className="text-lg font-bold text-gov-50">Optimization Center</h2>
                    <p className="text-xs text-gov-400">AI-Powered Resource Reallocation Engine</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="glass-card p-4 text-center fade-up stagger-1">
                    <TrendingDown size={22} className="text-emerald-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-emerald-400">{summary.totalRiskReduction}%</p>
                    <p className="text-xs text-gov-400 mt-1">Total Risk Reduction</p>
                </div>
                <div className="glass-card p-4 text-center fade-up stagger-2">
                    <Users size={22} className="text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-400">{summary.totalChildrenImpacted.toLocaleString()}</p>
                    <p className="text-xs text-gov-400 mt-1">Children Impacted</p>
                </div>
                <div className="glass-card p-4 text-center fade-up stagger-3">
                    <ShieldCheck size={22} className="text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-400">{summary.approved}</p>
                    <p className="text-xs text-gov-400 mt-1">Approved Reallocations</p>
                </div>
                <div className="glass-card p-4 text-center fade-up stagger-4">
                    <AlertTriangle size={22} className="text-amber-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-amber-400">{summary.pending}</p>
                    <p className="text-xs text-gov-400 mt-1">Pending Decisions</p>
                </div>
            </div>

            {/* Before vs After Chart */}
            <div className="glass-card p-5 fade-up stagger-5">
                <h3 className="text-sm font-semibold text-gov-50 mb-4 flex items-center gap-2">
                    <BarChart3 size={16} className="text-accent-light" />
                    Before vs After Risk Comparison
                </h3>
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={comparisonData} barCategoryGap="20%">
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="school" tick={{ fill: '#64748b', fontSize: 9 }} angle={-15} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{ background: '#1a2332', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                            labelStyle={{ color: '#94a3b8' }}
                        />
                        <Bar dataKey="riskBefore" name="Risk Before" radius={[4, 4, 0, 0]}>
                            {comparisonData.map((entry, i) => (
                                <Cell key={i} fill={getRiskColor(entry.riskBefore)} opacity={0.5} />
                            ))}
                        </Bar>
                        <Bar dataKey="riskAfter" name="Risk After" radius={[4, 4, 0, 0]}>
                            {comparisonData.map((entry, i) => (
                                <Cell key={i} fill={getRiskColor(entry.riskAfter)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Reallocation Table */}
            <div className="glass-card p-5 fade-up">
                <h3 className="text-sm font-semibold text-gov-50 mb-4">Reallocation Recommendations</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-gov-400 border-b border-gov-600">
                                <th className="text-left py-2 px-3 font-medium">School</th>
                                <th className="text-left py-2 px-3 font-medium">Block</th>
                                <th className="text-center py-2 px-3 font-medium">Current</th>
                                <th className="text-center py-2 px-3 font-medium" />
                                <th className="text-center py-2 px-3 font-medium">Recommended</th>
                                <th className="text-center py-2 px-3 font-medium">Risk Before</th>
                                <th className="text-center py-2 px-3 font-medium">Risk After</th>
                                <th className="text-center py-2 px-3 font-medium">Impact</th>
                                <th className="text-center py-2 px-3 font-medium">Status</th>
                                <th className="text-right py-2 px-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {optimizations.map((opt) => (
                                <tr key={opt.id} className="text-xs border-b border-gov-700/50 hover:bg-gov-700/30 transition-colors">
                                    <td className="py-2.5 px-3 text-gov-100 font-medium max-w-40 truncate">{opt.schoolName}</td>
                                    <td className="py-2.5 px-3 text-gov-300">{opt.block}</td>
                                    <td className="py-2.5 px-3 text-center text-gov-200">{opt.currentAllocation}</td>
                                    <td className="py-2.5 px-3 text-center"><ArrowRight size={12} className="text-gov-500 mx-auto" /></td>
                                    <td className="py-2.5 px-3 text-center text-accent-light font-medium">{opt.recommendedAllocation}</td>
                                    <td className="py-2.5 px-3 text-center">
                                        <span style={{ color: getRiskColor(opt.riskBefore) }}>{opt.riskBefore}%</span>
                                    </td>
                                    <td className="py-2.5 px-3 text-center">
                                        <span style={{ color: getRiskColor(opt.riskAfter) }}>{opt.riskAfter}%</span>
                                    </td>
                                    <td className="py-2.5 px-3 text-center text-gov-200">{opt.childrenImpacted}</td>
                                    <td className="py-2.5 px-3 text-center">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${opt.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                                opt.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-amber-500/20 text-amber-400'
                                            }`}>
                                            {opt.status}
                                        </span>
                                    </td>
                                    <td className="py-2.5 px-3 text-right">
                                        {opt.status === 'pending' && (
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => updateOptimizationStatus(opt.id, 'approved')}
                                                    className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer"
                                                    title="Approve"
                                                >
                                                    <CheckCircle2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => updateOptimizationStatus(opt.id, 'rejected')}
                                                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                                                    title="Reject"
                                                >
                                                    <XCircle size={14} />
                                                </button>
                                            </div>
                                        )}
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

export default OptimizationCenter;
