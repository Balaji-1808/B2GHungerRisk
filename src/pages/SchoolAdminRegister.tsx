import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { GraduationCap, Shield, ArrowLeft, Eye, EyeOff, UserPlus, Search } from 'lucide-react';
import { DISTRICTS, getBlocksByDistrict, getAllDistrictNames, getSchoolsByDistrict, searchSchools, type SchoolData } from '../services/districts';

const SCHOOL_TYPES = ['School', 'Hostel', 'Residential School'];

const SchoolAdminRegister: React.FC = () => {
    const login = useAuthStore((s) => s.login);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [schoolSearch, setSchoolSearch] = useState('');
    const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
    
    const [formData, setFormData] = useState({
        fullName: '',
        schoolName: '',
        udiseCode: '',
        block: '',
        district: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        enrollment: '',
        kitchenCapacity: '',
        schoolType: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Get available blocks based on selected district
    const availableBlocks = formData.district ? getBlocksByDistrict(formData.district) : [];

    // Search schools based on district and search query
    const filteredSchools = useMemo(() => {
        if (!formData.district) return [];
        if (!schoolSearch) return getSchoolsByDistrict(formData.district);
        return searchSchools(schoolSearch, formData.district);
    }, [formData.district, schoolSearch]);

    const handleDistrictChange = (district: string) => {
        setFormData({
            ...formData,
            district,
            block: '', // Reset block when district changes
            schoolName: '',
            udiseCode: ''
        });
        setSchoolSearch('');
    };

    const handleSchoolSelect = (school: SchoolData) => {
        setFormData({
            ...formData,
            schoolName: school.name,
            udiseCode: school.udiseCode,
            block: school.block,
        });
        setSchoolSearch(school.name);
        setShowSchoolDropdown(false);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.schoolName.trim()) newErrors.schoolName = 'School/Hostel name is required';
        if (!formData.udiseCode.trim()) newErrors.udiseCode = 'UDISE Code is required';
        if (!formData.district) newErrors.district = 'District selection is required';
        if (!formData.block) newErrors.block = 'Block selection is required';
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+91\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Must be in +91XXXXXXXXXX format';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setTimeout(() => {
            localStorage.setItem('school_admin_credentials', JSON.stringify({
                email: formData.email || formData.udiseCode,
                password: formData.password,
                profile: formData
            }));
            
            login('school_admin', formData);
            navigate('/dashboard');
        }, 800);
    };

    return (
        <div className="min-h-screen bg-gov-900 flex items-center justify-center p-6">
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.3) 1px, transparent 0)',
                    backgroundSize: '40px 40px',
                }} />
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-600 via-teal-400 to-emerald-400" />

            <div className="relative z-10 w-full max-w-2xl">
                <Link to="/login/school-admin" className="inline-flex items-center gap-2 text-gov-400 hover:text-gov-200 text-sm mb-8 transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to login
                </Link>

                <div className="glass-card p-8 fade-up">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-400 mb-4 shadow-lg shadow-teal-500/20">
                            <GraduationCap size={30} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gov-50">Register as School Admin</h1>
                        <p className="text-sm text-gov-400 mt-1">Create your account to access the system</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">Full Name *</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 placeholder-gov-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all text-sm"
                                    placeholder="R. Venkatesh"
                                />
                                {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">School/Hostel Name * (Search from database)</label>
                                <div className="relative">
                                    <div className="relative">
                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gov-500" />
                                        <input
                                            type="text"
                                            value={schoolSearch}
                                            onChange={(e) => {
                                                setSchoolSearch(e.target.value);
                                                setShowSchoolDropdown(true);
                                            }}
                                            onFocus={() => setShowSchoolDropdown(true)}
                                            disabled={!formData.district}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 placeholder-gov-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder={formData.district ? "Search school name or UDISE code..." : "Select district first"}
                                        />
                                    </div>
                                    {showSchoolDropdown && filteredSchools.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-gov-800 border border-gov-600 rounded-xl shadow-lg">
                                            {filteredSchools.map((school) => (
                                                <button
                                                    key={school.udiseCode}
                                                    type="button"
                                                    onClick={() => handleSchoolSelect(school)}
                                                    className="w-full text-left px-4 py-3 hover:bg-gov-700 transition-colors border-b border-gov-700 last:border-0"
                                                >
                                                    <p className="text-sm text-gov-100 font-medium">{school.name}</p>
                                                    <p className="text-xs text-gov-400 mt-0.5">
                                                        {school.block} • UDISE: {school.udiseCode}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {errors.schoolName && <p className="text-xs text-red-400 mt-1">{errors.schoolName}</p>}
                                {formData.district && filteredSchools.length === 0 && schoolSearch && (
                                    <p className="text-xs text-amber-400 mt-1">No schools found. You can manually enter details below.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">UDISE Code / Hostel Reg. No. *</label>
                                <input
                                    type="text"
                                    value={formData.udiseCode}
                                    onChange={(e) => setFormData({ ...formData, udiseCode: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 placeholder-gov-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all text-sm"
                                    placeholder="33010100101"
                                />
                                {errors.udiseCode && <p className="text-xs text-red-400 mt-1">{errors.udiseCode}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">School Type</label>
                                <select
                                    value={formData.schoolType}
                                    onChange={(e) => setFormData({ ...formData, schoolType: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all text-sm"
                                >
                                    <option value="">Select type</option>
                                    {SCHOOL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">District *</label>
                                <select
                                    value={formData.district}
                                    onChange={(e) => handleDistrictChange(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all text-sm"
                                >
                                    <option value="">Select district</option>
                                    {getAllDistrictNames().map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                {errors.district && <p className="text-xs text-red-400 mt-1">{errors.district}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">Block *</label>
                                <input
                                    type="text"
                                    value={formData.block}
                                    readOnly
                                    className="w-full px-4 py-3 rounded-xl bg-gov-700 border border-gov-600 text-gov-300 text-sm cursor-not-allowed"
                                    placeholder="Auto-filled from school selection"
                                />
                                {errors.block && <p className="text-xs text-red-400 mt-1">{errors.block}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">Phone Number *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 placeholder-gov-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all text-sm"
                                    placeholder="+919876543210"
                                />
                                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">Official Email (Optional)</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 placeholder-gov-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all text-sm"
                                    placeholder="school@edu.in"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">Total Enrollment</label>
                                <input
                                    type="number"
                                    value={formData.enrollment}
                                    onChange={(e) => setFormData({ ...formData, enrollment: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 placeholder-gov-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all text-sm"
                                    placeholder="450"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">Kitchen Capacity (meals/day)</label>
                                <input
                                    type="number"
                                    value={formData.kitchenCapacity}
                                    onChange={(e) => setFormData({ ...formData, kitchenCapacity: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 placeholder-gov-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all text-sm"
                                    placeholder="400"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">Password *</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 placeholder-gov-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all text-sm pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gov-500 hover:text-gov-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">Confirm Password *</label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 placeholder-gov-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all text-sm"
                                    placeholder="••••••••"
                                />
                                {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-400 text-white font-semibold text-sm hover:from-teal-500 hover:to-teal-300 transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-teal-500/20 cursor-pointer"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-gov-700 flex items-center justify-center gap-2 text-gov-500">
                        <Shield size={14} />
                        <span className="text-[11px]">Secured Government Portal</span>
                    </div>
                </div>

                <p className="text-center text-xs text-gov-400 mt-4">
                    Already have an account? <Link to="/login/school-admin" className="text-teal-400 hover:text-teal-300">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default SchoolAdminRegister;
