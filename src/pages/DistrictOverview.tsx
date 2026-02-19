import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { Map, Filter, AlertTriangle, Users, TrendingUp, ChevronRight } from 'lucide-react';
import { getBlocksByDistrict } from '../services/districts';
import { getRiskColor } from '../utils/risk';

const DistrictOverview: React.FC = () => {
    const { schools, selectedBlock, setSelectedBlock } = useAppStore();
    const { user, userDistrict } = useAuthStore();
    const [hoveredSchool, setHoveredSchool] = useState<string | null>(null);
    const navigate = useNavigate();

    // Get blocks for the current district
    const BLOCKS = useMemo(() => getBlocksByDistrict(userDistrict), [userDistrict]);

    // Auto-select block for block officers
    useEffect(() => {
        if (user?.role === 'block_officer' && user.block && selectedBlock === 'All') {
            setSelectedBlock(user.block);
        }
    }, [user, selectedBlock, setSelectedBlock]);

    const filteredSchools = useMemo(() =>
        selectedBlock === 'All' ? schools : schools.filter((s) => s.block === selectedBlock),
        [schools, selectedBlock]
    );

    // Block-level summaries (filter for block officer)
    const blockSummaries = useMemo(() => {
        const blocksToShow = user?.role === 'block_officer' && user.block 
            ? [user.block] 
            : BLOCKS;
        
        return blocksToShow.map((block) => {
            const bSchools = schools.filter((s) => s.block === block);
            const avgRisk = bSchools.length > 0 
                ? Math.round(bSchools.reduce((s, sc) => s + sc.riskScore, 0) / bSchools.length)
                : 0;
            const highRisk = bSchools.filter((s) => s.riskScore >= 70).length;
            const totalEnrollment = bSchools.reduce((s, sc) => s + sc.enrollment, 0);
            const cascadeSchools = bSchools.filter((s) => s.cascadeRisk).length;
            return { block, schoolCount: bSchools.length, avgRisk, highRisk, totalEnrollment, cascadeSchools };
        });
    }, [schools, user]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Map size={22} className="text-accent-light" />
                    <div>
                        <h2 className="text-lg font-bold text-gov-50">
                            {user?.role === 'block_officer' && user.block 
                                ? `${user.block} Block Overview` 
                                : 'District Overview'}
                        </h2>
                        <p className="text-xs text-gov-400">Digital Twin Monitor · Real-time Risk Visualization</p>
                    </div>
                </div>

                {/* Block Filter - Only show for district officers */}
                {user?.role === 'district_officer' && (
                    <div className="flex items-center gap-2">
                        <Filter size={14} className="text-gov-400" />
                        <select
                            value={selectedBlock}
                            onChange={(e) => setSelectedBlock(e.target.value)}
                            className="bg-gov-700 border border-gov-600 text-gov-200 text-xs rounded-lg px-3 py-2 focus:border-accent outline-none"
                        >
                            <option value="All">All Blocks</option>
                            {BLOCKS.map((b) => (
                                <option key={b} value={b}>{b}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Block Summary Cards */}
            <div className={`grid gap-3 ${user?.role === 'block_officer' ? 'grid-cols-1' : 'grid-cols-5'}`}>
                {blockSummaries.map((bs) => (
                    <button
                        key={bs.block}
                        onClick={() => user?.role === 'district_officer' && setSelectedBlock(bs.block === selectedBlock ? 'All' : bs.block)}
                        disabled={user?.role === 'block_officer'}
                        className={`glass-card p-3 transition-all text-left ${
                            user?.role === 'district_officer' 
                                ? 'cursor-pointer hover:scale-[1.02]' 
                                : 'cursor-default'
                        } ${selectedBlock === bs.block ? 'border-accent/50 ring-1 ring-accent/20' : ''}`}
                    >
                        <p className="text-xs font-semibold text-gov-100 mb-2">{bs.block}</p>
                        <div className="grid grid-cols-2 gap-y-1 text-[10px]">
                            <span className="text-gov-400">Schools</span>
                            <span className="text-right text-gov-200">{bs.schoolCount}</span>
                            <span className="text-gov-400">Avg Risk</span>
                            <span className="text-right font-medium" style={{ color: getRiskColor(bs.avgRisk) }}>{bs.avgRisk}%</span>
                            <span className="text-gov-400">High Risk</span>
                            <span className="text-right text-red-400 font-medium">{bs.highRisk}</span>
                            <span className="text-gov-400">Cascade</span>
                            <span className="text-right text-amber-400 font-medium">{bs.cascadeSchools}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* School Grid — Digital Twin Heatmap */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gov-50">
                        School Risk Heatmap
                        <span className="text-gov-400 font-normal ml-2">({filteredSchools.length} schools)</span>
                    </h3>
                    <div className="flex items-center gap-3 text-[10px]">
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low (&lt;40)</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium (40–70)</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> High (&gt;70)</span>
                    </div>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {filteredSchools.map((school) => {
                        const isHovered = hoveredSchool === school.id;
                        const riskColor = getRiskColor(school.riskScore);

                        return (
                            <div key={school.id} className="relative">
                                <button
                                    onClick={() => navigate(`/school/${school.id}`)}
                                    onMouseEnter={() => setHoveredSchool(school.id)}
                                    onMouseLeave={() => setHoveredSchool(null)}
                                    className="w-full aspect-square rounded-lg border transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1 hover:scale-110 hover:z-20"
                                    style={{
                                        backgroundColor: `${riskColor}15`,
                                        borderColor: `${riskColor}40`,
                                        boxShadow: isHovered ? `0 0 20px ${riskColor}40` : 'none',
                                    }}
                                >
                                    <span className="text-[10px] font-bold" style={{ color: riskColor }}>
                                        {school.riskScore}
                                    </span>
                                    <span className="text-[8px] text-gov-400 truncate w-full px-1 text-center">
                                        {school.id}
                                    </span>
                                    {school.cascadeRisk && (
                                        <AlertTriangle size={8} className="text-amber-400 absolute top-1 right-1" />
                                    )}
                                </button>

                                {/* Hover Tooltip */}
                                {isHovered && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 bg-gov-800 border border-gov-500 rounded-xl p-3 shadow-xl pointer-events-none slide-in-right">
                                        <p className="text-xs font-semibold text-gov-50 mb-2 truncate">{school.name}</p>
                                        <div className="space-y-1.5 text-[11px]">
                                            <div className="flex justify-between">
                                                <span className="text-gov-400 flex items-center gap-1"><TrendingUp size={10} /> Forecast Demand</span>
                                                <span className="text-gov-200">{school.avgMealUptake}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gov-400 flex items-center gap-1"><Users size={10} /> Capacity</span>
                                                <span className="text-gov-200">{school.capacity}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gov-400">Risk %</span>
                                                <span className="font-semibold" style={{ color: riskColor }}>{school.riskScore}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gov-400">Cascade Risk</span>
                                                <span className={school.cascadeRisk ? 'text-amber-400 font-medium' : 'text-gov-500'}>
                                                    {school.cascadeRisk ? 'Yes ⚠' : 'No'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-gov-600 flex items-center justify-center text-accent-light text-[10px] gap-1">
                                            Click to view detail <ChevronRight size={10} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DistrictOverview;
