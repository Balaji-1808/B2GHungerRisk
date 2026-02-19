import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Building2, Users, GraduationCap, ArrowRight } from 'lucide-react';

const roles: { path: string; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
        path: '/login/district-officer',
        label: 'District Officer',
        desc: 'Full access to analytics, optimization, and simulation',
        icon: <Building2 size={28} />,
        color: 'from-blue-600 to-blue-400',
    },
    {
        path: '/login/block-officer',
        label: 'Block Officer',
        desc: 'Block-level analytics, monitoring, and reporting',
        icon: <Users size={28} />,
        color: 'from-purple-600 to-purple-400',
    },
    {
        path: '/login/school-admin',
        label: 'School Admin',
        desc: 'School-level view, reporting, and shortage alerts',
        icon: <GraduationCap size={28} />,
        color: 'from-teal-600 to-teal-400',
    },
];

const Login: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gov-900 flex items-center justify-center p-6">
            {/* Background grid effect */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.3) 1px, transparent 0)',
                    backgroundSize: '40px 40px',
                }} />
            </div>

            <div className="relative z-10 w-full max-w-xl">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-4">
                        <Shield size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gov-50">
                        Hunger-Risk <span className="text-accent-light">Digital Twin</span>
                    </h1>
                    <p className="text-sm text-gov-400 mt-2">
                        AI-Powered Decision Support · SDG 2 – Zero Hunger
                    </p>
                    <p className="text-xs text-gov-500 mt-1">
                        Select your role to sign in
                    </p>
                </div>

                {/* Role Cards */}
                <div className="space-y-3">
                    {roles.map((r) => (
                        <button
                            key={r.path}
                            onClick={() => navigate(r.path)}
                            className="w-full glass-card glass-card-hover p-5 flex items-center gap-4 group cursor-pointer"
                        >
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center text-white transition-transform group-hover:scale-110`}>
                                {r.icon}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-sm font-semibold text-gov-50">{r.label}</p>
                                <p className="text-xs text-gov-400 mt-0.5">{r.desc}</p>
                            </div>
                            <ArrowRight size={18} className="text-gov-500 group-hover:text-accent-light transition-colors" />
                        </button>
                    ))}
                </div>

                {/* Get Started / Register Section */}
                <div className="mt-6 glass-card p-4 text-center">
                    <p className="text-xs text-gov-400 mb-3">New to the system?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate('/register/district-officer')}
                            className="flex-1 py-2 rounded-lg bg-gov-700 hover:bg-gov-600 text-gov-200 hover:text-gov-50 text-xs font-medium transition-colors"
                        >
                            Register as District Officer
                        </button>
                        <button
                            onClick={() => navigate('/register/block-officer')}
                            className="flex-1 py-2 rounded-lg bg-gov-700 hover:bg-gov-600 text-gov-200 hover:text-gov-50 text-xs font-medium transition-colors"
                        >
                            Register as Block Officer
                        </button>
                        <button
                            onClick={() => navigate('/register/school-admin')}
                            className="flex-1 py-2 rounded-lg bg-gov-700 hover:bg-gov-600 text-gov-200 hover:text-gov-50 text-xs font-medium transition-colors"
                        >
                            Register as School Admin
                        </button>
                    </div>
                </div>

                <p className="text-center text-[11px] text-gov-500 mt-8">
                    Prototype for demonstration · Mock data only · v1.0
                </p>
            </div>
        </div>
    );
};

export default Login;
