import React, { useMemo, useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';
import { FileText, Download, Filter, School, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { BLOCKS } from '../services/mockData';
import { getRiskColor } from '../utils/risk';
import {
    getDistrictFinancialSummary,
    getBlockFinancialData,
    getSchoolFinancialData,
    formatCurrency,
} from '../services/financialData';

const Reports: React.FC = () => {
    const { schools, optimizations } = useAppStore();
    const { user, userDistrict } = useAuthStore();
    const [blockFilter, setBlockFilter] = useState('All');

    // Auto-set block filter based on user role
    useEffect(() => {
        if (user?.role === 'block_officer' && user.block) {
            setBlockFilter(user.block);
        } else if (user?.role === 'school_admin') {
            setBlockFilter('All'); // Will be filtered by school anyway
        }
    }, [user]);

    // Filter schools based on user role
    const roleFilteredSchools = useMemo(() => {
        if (!user) return schools;
        
        if (user.role === 'school_admin' && user.schoolId) {
            return schools.filter(s => s.id === user.schoolId);
        }
        
        if (user.role === 'block_officer' && user.block) {
            return schools.filter(s => s.block === user.block);
        }
        
        return schools; // district_officer sees all
    }, [schools, user]);

    const filtered = useMemo(() =>
        blockFilter === 'All' ? roleFilteredSchools : roleFilteredSchools.filter((s) => s.block === blockFilter),
        [roleFilteredSchools, blockFilter]
    );

    // CSV Export Function
    const handleExportCSV = () => {
        if (!user) return;

        let csvContent = '';
        let filename = '';

        if (user.role === 'district_officer') {
            // District Officer: Export all schools with financial data
            filename = `${userDistrict}_District_Report_${new Date().toISOString().split('T')[0]}.csv`;
            
            csvContent = 'School ID,School Name,Block,Enrollment,Attendance,Capacity,Meal Uptake,Risk Score,Risk Level,Cascade Risk,Shortage Reported,Allocation,Released,Utilized,Released %,Utilized %\n';
            
            roleFilteredSchools.forEach(school => {
                const financialData = getSchoolFinancialData(school.id, school.district, school.block, school.enrollment);
                csvContent += `"${school.id}","${school.name}","${school.block}",${school.enrollment},${school.currentAttendance},${school.capacity},${school.avgMealUptake},${school.riskScore},"${school.riskLevel}",${school.cascadeRisk ? 'Yes' : 'No'},${school.shortageReported ? 'Yes' : 'No'}`;
                
                if (financialData) {
                    csvContent += `,${financialData.allocationAmount},${financialData.releasedAmount},${financialData.utilizedAmount},${((financialData.releasedAmount / financialData.allocationAmount) * 100).toFixed(2)},${((financialData.utilizedAmount / financialData.allocationAmount) * 100).toFixed(2)}\n`;
                } else {
                    csvContent += ',,,,,\n';
                }
            });

        } else if (user.role === 'block_officer' && user.block) {
            // Block Officer: Export their block's schools
            filename = `${user.block}_Block_Report_${new Date().toISOString().split('T')[0]}.csv`;
            
            csvContent = 'School ID,School Name,UDISE Code,Enrollment,Attendance,Capacity,Meal Uptake,Risk Score,Risk Level,Cascade Risk,Shortage Reported,Allocation,Released,Utilized,Released %,Utilized %\n';
            
            roleFilteredSchools.forEach(school => {
                const financialData = getSchoolFinancialData(school.id, school.district, school.block, school.enrollment);
                csvContent += `"${school.id}","${school.name}","${school.id}",${school.enrollment},${school.currentAttendance},${school.capacity},${school.avgMealUptake},${school.riskScore},"${school.riskLevel}",${school.cascadeRisk ? 'Yes' : 'No'},${school.shortageReported ? 'Yes' : 'No'}`;
                
                if (financialData) {
                    csvContent += `,${financialData.allocationAmount},${financialData.releasedAmount},${financialData.utilizedAmount},${((financialData.releasedAmount / financialData.allocationAmount) * 100).toFixed(2)},${((financialData.utilizedAmount / financialData.allocationAmount) * 100).toFixed(2)}\n`;
                } else {
                    csvContent += ',,,,,\n';
                }
            });

        } else if (user.role === 'school_admin' && user.schoolId) {
            // School Admin: Export their school's detailed report
            const school = roleFilteredSchools[0];
            if (!school) return;
            
            filename = `${school.name.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.csv`;
            
            const financialData = getSchoolFinancialData(school.id, school.district, school.block, school.enrollment);
            
            csvContent = 'Metric,Value\n';
            csvContent += `"School Name","${school.name}"\n`;
            csvContent += `"UDISE Code","${school.id}"\n`;
            csvContent += `"Block","${school.block}"\n`;
            csvContent += `"District","${school.district}"\n`;
            csvContent += `"Total Enrollment",${school.enrollment}\n`;
            csvContent += `"Current Attendance",${school.currentAttendance}\n`;
            csvContent += `"Attendance Rate","${((school.currentAttendance / school.enrollment) * 100).toFixed(2)}%"\n`;
            csvContent += `"Meal Capacity",${school.capacity}\n`;
            csvContent += `"Average Meal Uptake",${school.avgMealUptake}\n`;
            csvContent += `"Capacity Utilization","${((school.avgMealUptake / school.capacity) * 100).toFixed(2)}%"\n`;
            csvContent += `"Risk Score",${school.riskScore}\n`;
            csvContent += `"Risk Level","${school.riskLevel}"\n`;
            csvContent += `"Cascade Risk","${school.cascadeRisk ? 'Yes' : 'No'}"\n`;
            csvContent += `"Shortage Reported","${school.shortageReported ? 'Yes' : 'No'}"\n`;
            csvContent += `"Hostel Attached","${school.hostelAttached ? 'Yes' : 'No'}"\n`;
            csvContent += `"Last Inspection","${school.lastInspection}"\n`;
            
            if (financialData) {
                csvContent += '\n"Financial Data (FY 2024-25)"\n';
                csvContent += `"Total Allocation","₹${financialData.allocationAmount.toLocaleString('en-IN')}"\n`;
                csvContent += `"Released Amount","₹${financialData.releasedAmount.toLocaleString('en-IN')}"\n`;
                csvContent += `"Utilized Amount","₹${financialData.utilizedAmount.toLocaleString('en-IN')}"\n`;
                csvContent += `"Released Percentage","${((financialData.releasedAmount / financialData.allocationAmount) * 100).toFixed(2)}%"\n`;
                csvContent += `"Utilized Percentage","${((financialData.utilizedAmount / financialData.allocationAmount) * 100).toFixed(2)}%"\n`;
                csvContent += `"Utilization Efficiency","${((financialData.utilizedAmount / financialData.releasedAmount) * 100).toFixed(2)}%"\n`;
                csvContent += `"Per Student Allocation","₹${Math.round(financialData.allocationAmount / financialData.enrollment).toLocaleString('en-IN')}"\n`;
            }
        }

        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const blockStats = useMemo(() => {
        // Determine which blocks to show based on role
        let blocksToShow = BLOCKS;
        if (user?.role === 'block_officer' && user.block) {
            blocksToShow = [user.block];
        } else if (user?.role === 'school_admin' && user.block) {
            blocksToShow = [user.block];
        }

        return blocksToShow.map((block) => {
            const bSchools = roleFilteredSchools.filter((s) => s.block === block);
            const avgRisk = bSchools.length > 0 
                ? Math.round(bSchools.reduce((s, sc) => s + sc.riskScore, 0) / bSchools.length)
                : 0;
            const highRisk = bSchools.filter((s) => s.riskScore >= 70).length;
            const totalMeals = bSchools.reduce((s, sc) => s + sc.avgMealUptake, 0);
            const totalCapacity = bSchools.reduce((s, sc) => s + sc.capacity, 0);
            const utilization = totalCapacity > 0 ? Math.round((totalMeals / totalCapacity) * 100) : 0;
            return { block, schools: bSchools.length, avgRisk, highRisk, totalMeals, totalCapacity, utilization };
        });
    }, [roleFilteredSchools, user]);

    // Filter optimizations based on user role
    const roleFilteredOptimizations = useMemo(() => {
        if (!user) return optimizations;
        
        if (user.role === 'school_admin' && user.schoolId) {
            return optimizations.filter(o => o.schoolId === user.schoolId);
        }
        
        if (user.role === 'block_officer' && user.block) {
            return optimizations.filter(o => o.block === user.block);
        }
        
        return optimizations; // district_officer sees all
    }, [optimizations, user]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FileText size={22} className="text-accent-light" />
                    <div>
                        <h2 className="text-lg font-bold text-gov-50">
                            {user?.role === 'school_admin' ? 'School Report' :
                             user?.role === 'block_officer' ? `${user.block} Block Report` :
                             'Reports'}
                        </h2>
                        <p className="text-xs text-gov-400">
                            {user?.role === 'school_admin' ? 'School analytics and summaries' :
                             'Aggregated analytics and export-ready summaries'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Only show block filter for district officers */}
                    {user?.role === 'district_officer' && (
                        <div className="flex items-center gap-2">
                            <Filter size={14} className="text-gov-400" />
                            <select
                                value={blockFilter}
                                onChange={(e) => setBlockFilter(e.target.value)}
                                className="bg-gov-700 border border-gov-600 text-gov-200 text-xs rounded-lg px-3 py-2 focus:border-accent outline-none"
                            >
                                <option value="All">All Blocks</option>
                                {BLOCKS.map((b) => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                    )}
                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-3 py-2 bg-accent hover:bg-accent-light text-white text-xs rounded-lg transition-colors cursor-pointer"
                    >
                        <Download size={14} /> Export CSV
                    </button>
                </div>
            </div>

            {/* School Admin Summary Card */}
            {user?.role === 'school_admin' && filtered.length === 1 && (
                <div className="glass-card p-5 fade-up">
                    <h3 className="text-sm font-semibold text-gov-50 mb-4 flex items-center gap-2">
                        <School size={16} className="text-accent-light" />
                        {filtered[0].name} - Performance Summary
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="bg-gov-700/30 rounded-lg p-4 text-center">
                            <p className="text-xs text-gov-400 mb-2">Total Enrollment</p>
                            <p className="text-2xl font-bold text-gov-50">{filtered[0].enrollment}</p>
                        </div>
                        <div className="bg-gov-700/30 rounded-lg p-4 text-center">
                            <p className="text-xs text-gov-400 mb-2">Current Attendance</p>
                            <p className="text-2xl font-bold text-gov-50">{filtered[0].currentAttendance}</p>
                            <p className="text-[10px] text-gov-500 mt-1">
                                {Math.round((filtered[0].currentAttendance / filtered[0].enrollment) * 100)}% of enrollment
                            </p>
                        </div>
                        <div className="bg-gov-700/30 rounded-lg p-4 text-center">
                            <p className="text-xs text-gov-400 mb-2">Meal Capacity</p>
                            <p className="text-2xl font-bold text-gov-50">{filtered[0].capacity}</p>
                        </div>
                        <div className="bg-gov-700/30 rounded-lg p-4 text-center">
                            <p className="text-xs text-gov-400 mb-2">Risk Score</p>
                            <p className="text-2xl font-bold" style={{ color: getRiskColor(filtered[0].riskScore) }}>
                                {filtered[0].riskScore}%
                            </p>
                            <p className="text-[10px] text-gov-500 mt-1">{filtered[0].riskLevel} risk</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="bg-gov-700/30 rounded-lg p-3">
                            <p className="text-xs text-gov-400 mb-1">Avg Meal Uptake</p>
                            <p className="text-lg font-bold text-gov-50">{filtered[0].avgMealUptake}</p>
                        </div>
                        <div className="bg-gov-700/30 rounded-lg p-3">
                            <p className="text-xs text-gov-400 mb-1">Cascade Risk</p>
                            <p className={`text-lg font-bold ${filtered[0].cascadeRisk ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {filtered[0].cascadeRisk ? 'Yes ⚠' : 'No ✓'}
                            </p>
                        </div>
                        <div className="bg-gov-700/30 rounded-lg p-3">
                            <p className="text-xs text-gov-400 mb-1">Shortage Reported</p>
                            <p className={`text-lg font-bold ${filtered[0].shortageReported ? 'text-red-400' : 'text-emerald-400'}`}>
                                {filtered[0].shortageReported ? 'Yes' : 'No'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Block Summary Table - Hide for school admin if only one school */}
            {!(user?.role === 'school_admin' && filtered.length === 1) && (
                <div className="glass-card p-5 fade-up">
                    <h3 className="text-sm font-semibold text-gov-50 mb-4 flex items-center gap-2">
                        <TrendingUp size={16} className="text-accent-light" />
                        {user?.role === 'school_admin' ? 'Block Summary' :
                         user?.role === 'block_officer' ? `${user.block} Block Summary` :
                         'Block-Level Summary'}
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-xs text-gov-400 border-b border-gov-600">
                                    <th className="text-left py-2 px-3 font-medium">Block</th>
                                    <th className="text-center py-2 px-3 font-medium">Schools</th>
                                    <th className="text-center py-2 px-3 font-medium">Avg Risk</th>
                                    <th className="text-center py-2 px-3 font-medium">High Risk</th>
                                    <th className="text-center py-2 px-3 font-medium">Total Meals/Day</th>
                                    <th className="text-center py-2 px-3 font-medium">Total Capacity</th>
                                    <th className="text-center py-2 px-3 font-medium">Utilization</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blockStats.map((bs) => (
                                    <tr key={bs.block} className="text-xs border-b border-gov-700/50 hover:bg-gov-700/30 transition-colors">
                                        <td className="py-2.5 px-3 text-gov-100 font-medium">{bs.block}</td>
                                        <td className="py-2.5 px-3 text-center text-gov-200">{bs.schools}</td>
                                        <td className="py-2.5 px-3 text-center">
                                            <span style={{ color: getRiskColor(bs.avgRisk) }} className="font-medium">{bs.avgRisk}%</span>
                                        </td>
                                        <td className="py-2.5 px-3 text-center text-red-400 font-medium">{bs.highRisk}</td>
                                        <td className="py-2.5 px-3 text-center text-gov-200">{bs.totalMeals.toLocaleString()}</td>
                                        <td className="py-2.5 px-3 text-center text-gov-200">{bs.totalCapacity.toLocaleString()}</td>
                                        <td className="py-2.5 px-3 text-center">
                                            <span className={`font-medium ${bs.utilization > 90 ? 'text-red-400' : bs.utilization > 75 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                {bs.utilization}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Financial Summary Table */}
            <div className="glass-card p-5 fade-up">
                <h3 className="text-sm font-semibold text-gov-50 mb-4 flex items-center gap-2">
                    <DollarSign size={16} className="text-emerald-400" />
                    {user?.role === 'school_admin' ? 'School Financial Report (FY 2024-25)' :
                     user?.role === 'block_officer' ? `${user.block} Block Financial Report (FY 2024-25)` :
                     'Financial Report (FY 2024-25)'}
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs text-gov-400 border-b border-gov-600">
                                <th className="text-left py-2 px-3 font-medium">
                                    {user?.role === 'district_officer' ? 'District' : 
                                     user?.role === 'block_officer' ? 'School' : 'School'}
                                </th>
                                {user?.role !== 'district_officer' && (
                                    <th className="text-left py-2 px-3 font-medium">UDISE Code</th>
                                )}
                                <th className="text-center py-2 px-3 font-medium">Enrollment</th>
                                <th className="text-right py-2 px-3 font-medium">Allocation</th>
                                <th className="text-right py-2 px-3 font-medium">Released</th>
                                <th className="text-center py-2 px-3 font-medium">Released %</th>
                                <th className="text-right py-2 px-3 font-medium">Utilized</th>
                                <th className="text-center py-2 px-3 font-medium">Utilized %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user?.role === 'district_officer' && (
                                (() => {
                                    const districtSummary = getDistrictFinancialSummary(userDistrict, schools);
                                    if (!districtSummary) return null;
                                    
                                    const districtSchools = schools.filter(s => s.district === userDistrict);
                                    const totalEnrollment = districtSchools.reduce((sum, s) => sum + s.enrollment, 0);
                                    
                                    return (
                                        <tr className="text-xs border-b border-gov-700/50 hover:bg-gov-700/30 transition-colors">
                                            <td className="py-2.5 px-3 text-gov-100 font-medium">{districtSummary.district}</td>
                                            <td className="py-2.5 px-3 text-center text-gov-200">{totalEnrollment}</td>
                                            <td className="py-2.5 px-3 text-right text-gov-200 font-medium">
                                                {formatCurrency(districtSummary.totalAllocation)}
                                            </td>
                                            <td className="py-2.5 px-3 text-right text-emerald-400 font-medium">
                                                {formatCurrency(districtSummary.totalReleased)}
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                <span className="text-emerald-400 font-medium">{districtSummary.releasedPercentage.toFixed(1)}%</span>
                                            </td>
                                            <td className="py-2.5 px-3 text-right text-purple-400 font-medium">
                                                {formatCurrency(districtSummary.totalUtilized)}
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                <span className="text-purple-400 font-medium">{districtSummary.utilizedPercentage.toFixed(1)}%</span>
                                            </td>
                                        </tr>
                                    );
                                })()
                            )}
                            {user?.role === 'block_officer' && user.block && (
                                getBlockFinancialData(userDistrict, user.block, schools).map((schoolFinancial) => {
                                    const school = schools.find(s => s.id === schoolFinancial.schoolUDISE);
                                    return (
                                        <tr key={schoolFinancial.schoolUDISE} className="text-xs border-b border-gov-700/50 hover:bg-gov-700/30 transition-colors">
                                            <td className="py-2.5 px-3 text-gov-100 font-medium max-w-40 truncate">
                                                {school?.name || 'School'}
                                            </td>
                                            <td className="py-2.5 px-3 text-gov-400 font-mono text-[10px]">{schoolFinancial.schoolUDISE}</td>
                                            <td className="py-2.5 px-3 text-center text-gov-200">{schoolFinancial.enrollment}</td>
                                            <td className="py-2.5 px-3 text-right text-gov-200 font-medium">
                                                {formatCurrency(schoolFinancial.allocationAmount)}
                                            </td>
                                            <td className="py-2.5 px-3 text-right text-emerald-400 font-medium">
                                                {formatCurrency(schoolFinancial.releasedAmount)}
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                <span className="text-emerald-400 font-medium">
                                                    {((schoolFinancial.releasedAmount / schoolFinancial.allocationAmount) * 100).toFixed(1)}%
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-right text-purple-400 font-medium">
                                                {formatCurrency(schoolFinancial.utilizedAmount)}
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                <span className="text-purple-400 font-medium">
                                                    {((schoolFinancial.utilizedAmount / schoolFinancial.allocationAmount) * 100).toFixed(1)}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            {user?.role === 'school_admin' && user.schoolId && (
                                (() => {
                                    const school = schools.find(s => s.id === user.schoolId);
                                    if (!school) return null;
                                    const schoolFinancial = getSchoolFinancialData(user.schoolId, school.district, school.block, school.enrollment);
                                    if (!schoolFinancial) return null;
                                    return (
                                        <tr className="text-xs border-b border-gov-700/50 hover:bg-gov-700/30 transition-colors">
                                            <td className="py-2.5 px-3 text-gov-100 font-medium">
                                                {school.name}
                                            </td>
                                            <td className="py-2.5 px-3 text-gov-400 font-mono text-[10px]">{schoolFinancial.schoolUDISE}</td>
                                            <td className="py-2.5 px-3 text-center text-gov-200">{schoolFinancial.enrollment}</td>
                                            <td className="py-2.5 px-3 text-right text-gov-200 font-medium">
                                                {formatCurrency(schoolFinancial.allocationAmount)}
                                            </td>
                                            <td className="py-2.5 px-3 text-right text-emerald-400 font-medium">
                                                {formatCurrency(schoolFinancial.releasedAmount)}
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                <span className="text-emerald-400 font-medium">
                                                    {((schoolFinancial.releasedAmount / schoolFinancial.allocationAmount) * 100).toFixed(1)}%
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-right text-purple-400 font-medium">
                                                {formatCurrency(schoolFinancial.utilizedAmount)}
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                <span className="text-purple-400 font-medium">
                                                    {((schoolFinancial.utilizedAmount / schoolFinancial.allocationAmount) * 100).toFixed(1)}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })()
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* School Detail Table */}
            <div className="glass-card p-5 fade-up">
                <h3 className="text-sm font-semibold text-gov-50 mb-4 flex items-center gap-2">
                    <School size={16} className="text-accent-light" />
                    {user?.role === 'school_admin' ? 'School Details' :
                     user?.role === 'block_officer' ? `Schools in ${user.block} (${filtered.length})` :
                     `School-Level Report (${filtered.length} schools)`}
                </h3>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                    <table className="w-full">
                        <thead className="sticky top-0 bg-gov-800">
                            <tr className="text-xs text-gov-400 border-b border-gov-600">
                                <th className="text-left py-2 px-3 font-medium">ID</th>
                                <th className="text-left py-2 px-3 font-medium">School</th>
                                <th className="text-left py-2 px-3 font-medium">Block</th>
                                <th className="text-center py-2 px-3 font-medium">Enrollment</th>
                                <th className="text-center py-2 px-3 font-medium">Attendance</th>
                                <th className="text-center py-2 px-3 font-medium">Capacity</th>
                                <th className="text-center py-2 px-3 font-medium">Meal Uptake</th>
                                <th className="text-center py-2 px-3 font-medium">Risk</th>
                                <th className="text-center py-2 px-3 font-medium">Cascade</th>
                                <th className="text-center py-2 px-3 font-medium">Shortage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s) => (
                                <tr key={s.id} className="text-xs border-b border-gov-700/50 hover:bg-gov-700/30 transition-colors">
                                    <td className="py-2 px-3 text-gov-400 font-mono">{s.id}</td>
                                    <td className="py-2 px-3 text-gov-100 font-medium max-w-40 truncate">{s.name}</td>
                                    <td className="py-2 px-3 text-gov-300">{s.block}</td>
                                    <td className="py-2 px-3 text-center text-gov-200">{s.enrollment}</td>
                                    <td className="py-2 px-3 text-center text-gov-200">{s.currentAttendance}</td>
                                    <td className="py-2 px-3 text-center text-gov-200">{s.capacity}</td>
                                    <td className="py-2 px-3 text-center text-gov-200">{s.avgMealUptake}</td>
                                    <td className="py-2 px-3 text-center">
                                        <span className="font-medium" style={{ color: getRiskColor(s.riskScore) }}>{s.riskScore}%</span>
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                        {s.cascadeRisk && <AlertTriangle size={12} className="text-amber-400 mx-auto" />}
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                        {s.shortageReported && <span className="text-red-400 text-[10px] font-medium">Reported</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Optimization Summary - Only show if user has access to optimization data */}
            {user?.role !== 'school_admin' && (
                <div className="glass-card p-5 fade-up">
                    <h3 className="text-sm font-semibold text-gov-50 mb-2">
                        {user?.role === 'block_officer' ? `${user.block} Block Optimization Log` : 'Optimization Decisions Log'}
                    </h3>
                    <p className="text-xs text-gov-400 mb-4">
                        {roleFilteredOptimizations.filter(o => o.status === 'approved').length} approved · {roleFilteredOptimizations.filter(o => o.status === 'rejected').length} rejected · {roleFilteredOptimizations.filter(o => o.status === 'pending').length} pending
                    </p>
                </div>
            )}
        </div>
    );
};

export default Reports;
