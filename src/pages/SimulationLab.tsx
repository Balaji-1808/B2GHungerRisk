import React from 'react';
import { useSimulationStore } from '../store/simulationStore';
import {
    FlaskConical, SlidersHorizontal, CloudRain, Truck,
    Activity, Gauge, AlertTriangle, TrendingDown, TrendingUp,
    RotateCcw, Zap,
} from 'lucide-react';
import {
    RadialBarChart, RadialBar, ResponsiveContainer,
    PolarAngleAxis,
} from 'recharts';
import { getStressColor } from '../utils/risk';

const SimulationLab: React.FC = () => {
    const sim = useSimulationStore();

    const stabilityData = [{ name: 'Stability', value: sim.stabilityIndex, fill: sim.stabilityIndex > 60 ? '#22c55e' : sim.stabilityIndex > 30 ? '#f59e0b' : '#ef4444' }];
    const riskChangePositive = sim.resultRiskChange > 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FlaskConical size={22} className="text-accent-light" />
                    <div>
                        <h2 className="text-lg font-bold text-gov-50">Simulation Lab</h2>
                        <p className="text-xs text-gov-400">Policy Impact Modeling · What-If Scenario Engine</p>
                    </div>
                </div>
                <button
                    onClick={sim.reset}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gov-400 hover:text-gov-100 hover:bg-gov-700 transition-colors cursor-pointer"
                >
                    <RotateCcw size={14} /> Reset Scenario
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {/* ── Controls Panel ── */}
                <div className="glass-card p-5 space-y-6">
                    <h3 className="text-sm font-semibold text-gov-50 flex items-center gap-2">
                        <SlidersHorizontal size={16} className="text-accent-light" />
                        Scenario Controls
                    </h3>

                    {/* Capacity Slider */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs text-gov-300">Capacity Modifier</label>
                            <span className="text-xs font-semibold text-accent-light">{sim.capacityModifier > 0 ? '+' : ''}{sim.capacityModifier}%</span>
                        </div>
                        <input
                            type="range" min={-50} max={50} value={sim.capacityModifier}
                            onChange={(e) => sim.setCapacity(Number(e.target.value))}
                            className="w-full accent-blue-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-gov-500 mt-1">
                            <span>-50%</span><span>0</span><span>+50%</span>
                        </div>
                    </div>

                    {/* Budget Slider */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs text-gov-300">Budget Modifier</label>
                            <span className="text-xs font-semibold text-accent-light">{sim.budgetModifier > 0 ? '+' : ''}{sim.budgetModifier}%</span>
                        </div>
                        <input
                            type="range" min={-30} max={30} value={sim.budgetModifier}
                            onChange={(e) => sim.setBudget(Number(e.target.value))}
                            className="w-full accent-purple-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-gov-500 mt-1">
                            <span>-30%</span><span>0</span><span>+30%</span>
                        </div>
                    </div>

                    {/* Toggle: Weather */}
                    <button
                        onClick={sim.toggleWeather}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${sim.weatherDisruption
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                : 'bg-gov-700/30 border-gov-600 text-gov-400'
                            }`}
                    >
                        <CloudRain size={18} />
                        <div className="text-left flex-1">
                            <p className="text-xs font-medium">Weather Disruption</p>
                            <p className="text-[10px] opacity-70">Monsoon / heavy rain scenario</p>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-all ${sim.weatherDisruption ? 'bg-amber-500' : 'bg-gov-600'}`}>
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${sim.weatherDisruption ? 'left-5' : 'left-0.5'}`} />
                        </div>
                    </button>

                    {/* Toggle: Transport */}
                    <button
                        onClick={sim.toggleTransport}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${sim.transportDisruption
                                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                : 'bg-gov-700/30 border-gov-600 text-gov-400'
                            }`}
                    >
                        <Truck size={18} />
                        <div className="text-left flex-1">
                            <p className="text-xs font-medium">Transport Disruption</p>
                            <p className="text-[10px] opacity-70">Road closures / supply delays</p>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-all ${sim.transportDisruption ? 'bg-red-500' : 'bg-gov-600'}`}>
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${sim.transportDisruption ? 'left-5' : 'left-0.5'}`} />
                        </div>
                    </button>
                </div>

                {/* ── Results Panel ── */}
                <div className="col-span-2 space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Risk Change */}
                        <div className="glass-card p-5 text-center fade-up stagger-1">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                {riskChangePositive ? <TrendingUp size={20} className="text-red-400" /> : <TrendingDown size={20} className="text-emerald-400" />}
                            </div>
                            <p className={`text-3xl font-bold transition-all duration-500 ${riskChangePositive ? 'text-red-400' : 'text-emerald-400'}`}>
                                {sim.resultRiskChange > 0 ? '+' : ''}{sim.resultRiskChange}%
                            </p>
                            <p className="text-xs text-gov-400 mt-2">Risk Change</p>
                        </div>

                        {/* Stability Index */}
                        <div className="glass-card p-5 text-center fade-up stagger-2">
                            <ResponsiveContainer width="100%" height={80}>
                                <RadialBarChart
                                    cx="50%" cy="50%" innerRadius="60%" outerRadius="90%"
                                    data={stabilityData} startAngle={180} endAngle={0}
                                    barSize={8}
                                >
                                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                    <RadialBar background dataKey="value" cornerRadius={4} />
                                </RadialBarChart>
                            </ResponsiveContainer>
                            <p className="text-2xl font-bold text-gov-50 -mt-2">{sim.stabilityIndex}</p>
                            <p className="text-xs text-gov-400 mt-1">Stability Index</p>
                        </div>

                        {/* System Stress */}
                        <div className="glass-card p-5 text-center fade-up stagger-3">
                            <Gauge size={28} className={`mx-auto mb-2 ${getStressColor(sim.systemStress)}`} />
                            <p className={`text-xl font-bold capitalize ${getStressColor(sim.systemStress)}`}>
                                {sim.systemStress}
                            </p>
                            <p className="text-xs text-gov-400 mt-2">System Stress Level</p>
                        </div>
                    </div>

                    {/* Detail Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card p-4 flex items-center gap-4 fade-up stagger-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <AlertTriangle size={22} className="text-amber-400" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gov-50">{sim.affectedSchools}</p>
                                <p className="text-xs text-gov-400">Schools Affected</p>
                            </div>
                        </div>
                        <div className="glass-card p-4 flex items-center gap-4 fade-up stagger-5">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <Zap size={22} className="text-red-400" />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-gov-50">{sim.projectedShortages}</p>
                                <p className="text-xs text-gov-400">Projected Shortage Days</p>
                            </div>
                        </div>
                    </div>

                    {/* Scenario Summary */}
                    <div className="glass-card p-5 fade-up stagger-6">
                        <h3 className="text-sm font-semibold text-gov-50 mb-3 flex items-center gap-2">
                            <Activity size={16} className="text-accent-light" />
                            Scenario Analysis
                        </h3>
                        <div className="bg-gov-700/30 rounded-lg p-4 text-xs text-gov-300 leading-relaxed">
                            {sim.capacityModifier === 0 && sim.budgetModifier === 0 && !sim.weatherDisruption && !sim.transportDisruption ? (
                                <p className="text-gov-400 italic">Adjust the controls to model a scenario. The system will recalculate risk metrics in real-time.</p>
                            ) : (
                                <div className="space-y-2">
                                    {sim.capacityModifier !== 0 && (
                                        <p>• Capacity {sim.capacityModifier > 0 ? 'increase' : 'decrease'} of <strong>{Math.abs(sim.capacityModifier)}%</strong> {sim.capacityModifier > 0 ? 'reduces' : 'increases'} system risk.</p>
                                    )}
                                    {sim.budgetModifier !== 0 && (
                                        <p>• Budget {sim.budgetModifier > 0 ? 'increase' : 'cut'} of <strong>{Math.abs(sim.budgetModifier)}%</strong> {sim.budgetModifier > 0 ? 'improves' : 'worsens'} allocation flexibility.</p>
                                    )}
                                    {sim.weatherDisruption && (
                                        <p>• <span className="text-amber-400">Weather disruption</span> adds +18% to overall risk due to attendance drops and supply delays.</p>
                                    )}
                                    {sim.transportDisruption && (
                                        <p>• <span className="text-red-400">Transport disruption</span> adds +12% to risk from supply chain interruptions.</p>
                                    )}
                                    <p className="mt-2 pt-2 border-t border-gov-600">
                                        Net impact: <span className={riskChangePositive ? 'text-red-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                                            {sim.resultRiskChange > 0 ? '+' : ''}{sim.resultRiskChange}% risk change
                                        </span> affecting {sim.affectedSchools} schools.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimulationLab;
