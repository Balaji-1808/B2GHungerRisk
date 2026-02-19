import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
    LayoutDashboard, Map, School, Settings, FileText,
    Cpu, FlaskConical, LogOut, Shield, Activity,
} from 'lucide-react';
import type { UserRole } from '../../types';

interface NavItem {
    to: string;
    label: string;
    icon: React.ReactNode;
    roles: UserRole[];
}

const navItems: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, roles: ['district_officer', 'block_officer', 'school_admin'] },
    { to: '/district', label: 'District Overview', icon: <Map size={18} />, roles: ['district_officer', 'block_officer'] },
    { to: '/optimization', label: 'Optimization', icon: <Cpu size={18} />, roles: ['district_officer'] },
    { to: '/simulation', label: 'Simulation Lab', icon: <FlaskConical size={18} />, roles: ['district_officer', 'block_officer'] },
    { to: '/reports', label: 'Reports', icon: <FileText size={18} />, roles: ['district_officer', 'block_officer', 'school_admin'] },
    { to: '/settings', label: 'Settings', icon: <Settings size={18} />, roles: ['district_officer', 'block_officer', 'school_admin'] },
];

export const Sidebar: React.FC = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    if (!user) return null;

    const filtered = navItems.filter((item) => item.roles.includes(user.role));
    
    // Add school detail link for school admin with their specific school
    const navItemsWithSchool = user.role === 'school_admin' && user.schoolId
        ? [
            filtered[0], // Dashboard
            { to: `/school/${user.schoolId}`, label: 'My School', icon: <School size={18} />, roles: ['school_admin'] as UserRole[] },
            ...filtered.slice(1)
          ]
        : filtered;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-gov-800 border-r border-gov-600 flex flex-col z-40">
            {/* Brand */}
            <div className="p-5 border-b border-gov-600">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                        <Shield size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-gov-50 leading-tight">Hunger-Risk</h1>
                        <p className="text-[10px] text-gov-400 tracking-widest uppercase">Digital Twin</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {navItemsWithSchool.map((item) => {
                    const isActive = location.pathname.startsWith(item.to.split('/').slice(0, 2).join('/'));
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${isActive
                                    ? 'bg-accent/15 text-accent-light border border-accent/20'
                                    : 'text-gov-300 hover:bg-gov-700 hover:text-gov-100 border border-transparent'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    );
                })}
            </nav>

            {/* User info + logout */}
            <div className="p-4 border-t border-gov-600">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                        {user.name.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gov-100 truncate">{user.name}</p>
                        <p className="text-[10px] text-gov-400 flex items-center gap-1">
                            <Activity size={9} />
                            {user.role.replace('_', ' ')}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs text-gov-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                    <LogOut size={14} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};
