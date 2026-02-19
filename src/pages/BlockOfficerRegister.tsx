import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Users, Shield, ArrowLeft, Eye, EyeOff, UserPlus } from 'lucide-react';
import { DISTRICTS, getBlocksByDistrict, getAllDistrictNames } from '../services/districts';

const DESIGNATIONS = [
    'Block Education Officer (BEO)',
    'Block Development Officer (BDO)',
    'Block Program Coordinator',
    'Block Resource Person',
    'Other'
];

const BlockOfficerRegister: React.FC = () => {
    const login = useAuthStore((s) => s.login);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        block: '',
        district: '',
        employeeId: '',
        designation: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Get available blocks based on selected district
    const availableBlocks = formData.district ? getBlocksByDistrict(formData.district) : [];

    const handleDistrictChange = (district: string) => {
        setFormData({
            ...formData,
            district,
            block: '' // Reset block when district changes
        });
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!formData.email.endsWith('@gov.in')) {
            newErrors.email = 'Must be an official @gov.in email';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+91\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Must be in +91XXXXXXXXXX format';
        }
        if (!formData.district) newErrors.district = 'District selection is required';
        if (!formData.block) newErrors.block = 'Block selection is required';
        if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
        if (!formData.designation) newErrors.designation = 'Designation is required';
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
            localStorage.setItem('block_officer_credentials', JSON.stringify({
                email: formData.email,
                password: formData.password,
                profile: formData
            }));
            
            login('block_officer', formData);
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
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-purple-400 to-fuchsia-400" />

            <div className="relative z-10 w-full max-w-2xl">
                <Link to="/login/block-officer" className="inline-flex items-center gap-2 text-gov-400 hover:text-gov-200 text-sm mb-8 transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to login
                </Link>

                <div className="glass-card p-8 fade-up">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-400 mb-4 shadow-lg shadow-purple-500/20">
                            <Users size={30} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gov-50">Register as Block Officer</h1>
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
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 placeholder-gov-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all text-sm"
                                    placeholder="K. Priya"
                                />
                                {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">Official Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 placeholder-gov-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all text-sm"
                                    placeholder="name@gov.in"
                                />
                                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">Phone Number *</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 placeholder-gov-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all text-sm"
                                    placeholder="+919876543210"
                                />
                                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">District *</label>
                                <select
                                    value={formData.district}
                                    onChange={(e) => handleDistrictChange(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all text-sm"
                                >
                                    <option value="">Select district</option>
                                    {getAllDistrictNames().map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                {errors.district && <p className="text-xs text-red-400 mt-1">{errors.district}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">Block Name *</label>
                                <select
                                    value={formData.block}
                                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                                    disabled={!formData.district}
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">{formData.district ? 'Select block' : 'Select district first'}</option>
                                    {availableBlocks.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                                {errors.block && <p className="text-xs text-red-400 mt-1">{errors.block}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">Employee ID *</label>
                                <input
                                    type="text"
                                    value={formData.employeeId}
                                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 placeholder-gov-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all text-sm"
                                    placeholder="BO-001"
                                />
                                {errors.employeeId && <p className="text-xs text-red-400 mt-1">{errors.employeeId}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">Designation *</label>
                                <select
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all text-sm"
                                >
                                    <option value="">Select designation</option>
                                    {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                {errors.designation && <p className="text-xs text-red-400 mt-1">{errors.designation}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gov-300 mb-1.5">Password *</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 placeholder-gov-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all text-sm pr-12"
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
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 placeholder-gov-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all text-sm"
                                    placeholder="••••••••"
                                />
                                {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-400 text-white font-semibold text-sm hover:from-purple-500 hover:to-purple-300 transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-purple-500/20 cursor-pointer"
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
                    Already have an account? <Link to="/login/block-officer" className="text-purple-400 hover:text-purple-300">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default BlockOfficerRegister;
