import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { GraduationCap, Shield, ArrowLeft, Eye, EyeOff, LogIn } from 'lucide-react';

const SchoolAdminLogin: React.FC = () => {
    const login = useAuthStore((s) => s.login);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Check if user has registered credentials
        const stored = localStorage.getItem('school_admin_credentials');
        if (stored) {
            const { email, password: storedPassword, profile } = JSON.parse(stored);
            if (username === email && password === storedPassword) {
                setTimeout(() => {
                    login('school_admin', profile);
                    navigate('/dashboard');
                }, 600);
                return;
            }
        }
        
        // Allow any credentials for demo
        setTimeout(() => {
            login('school_admin');
            navigate('/dashboard');
        }, 600);
    };

    return (
        <div className="min-h-screen bg-gov-900 flex items-center justify-center p-6">
            {/* Background effects */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.3) 1px, transparent 0)',
                    backgroundSize: '40px 40px',
                }} />
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-600 via-teal-400 to-emerald-400" />

            <div className="relative z-10 w-full max-w-md">
                {/* Back link */}
                <Link to="/login" className="inline-flex items-center gap-2 text-gov-400 hover:text-gov-200 text-sm mb-8 transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to role selection
                </Link>

                <div className="glass-card p-8 fade-up">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-400 mb-4 shadow-lg shadow-teal-500/20">
                            <GraduationCap size={30} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gov-50">School Admin</h1>
                        <p className="text-sm text-gov-400 mt-1">School-level view, reporting & shortage alerts</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Demo Credentials Info */}
                        <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-3 mb-4">
                            <p className="text-xs text-teal-400 font-medium mb-1">Demo Mode - Any credentials work!</p>
                            <p className="text-[10px] text-gov-400">
                                Try: <span className="text-gov-300 font-mono">admin</span> / <span className="text-gov-300 font-mono">password</span>
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gov-300 mb-1.5">Username / Employee ID</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g. SA-001"
                                className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 placeholder-gov-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gov-300 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl bg-gov-800 border border-gov-600 text-gov-50 placeholder-gov-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all text-sm pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gov-500 hover:text-gov-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center gap-2 text-gov-400 cursor-pointer">
                                <input type="checkbox" className="rounded border-gov-600 bg-gov-800 text-teal-500 focus:ring-teal-500/30" />
                                Remember me
                            </label>
                            <a href="#" className="text-teal-400 hover:text-teal-300 transition-colors">Forgot password?</a>
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
                                    <LogIn size={18} />
                                    Sign in as School Admin
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 pt-5 border-t border-gov-700 flex items-center justify-center gap-2 text-gov-500">
                        <Shield size={14} />
                        <span className="text-[11px]">Secured Government Portal</span>
                    </div>
                </div>

                <p className="text-center text-xs text-gov-400 mt-4">
                    Don't have an account? <Link to="/register/school-admin" className="text-teal-400 hover:text-teal-300">Register here</Link>
                </p>

                <p className="text-center text-[11px] text-gov-500 mt-6">
                    Prototype for demonstration · Mock data only · v1.0
                </p>
            </div>
        </div>
    );
};

export default SchoolAdminLogin;
