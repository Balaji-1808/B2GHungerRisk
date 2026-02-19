import React from 'react';
import { Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';

export const Topbar: React.FC = () => {
    const user = useAuthStore((s) => s.user);
    const { alerts, toggleAlertDrawer } = useAppStore();
    const unreadCount = alerts.filter((a) => !a.read).length;

    const roleLabels: Record<string, string> = {
        district_officer: 'District Officer',
        block_officer: 'Block Officer',
        school_admin: 'School Admin',
    };

    const roleBadgeColors: Record<string, string> = {
        district_officer: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        block_officer: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        school_admin: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    };

    return (
        <header className="fixed top-0 left-64 right-0 h-14 bg-gov-800/80 backdrop-blur-md border-b border-gov-600 flex items-center justify-between px-6 z-30">
            <div className="flex items-center gap-3">
                <h2 className="text-sm font-medium text-gov-200">
                    Welcome back, <span className="text-gov-50 font-semibold">{user?.name}</span>
                </h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Role badge */}
                {user && (
                    <span className={`px-3 py-1 rounded-full text-[11px] font-medium border ${roleBadgeColors[user.role]}`}>
                        {roleLabels[user.role]}
                    </span>
                )}

                {/* Alert bell */}
                <button
                    onClick={toggleAlertDrawer}
                    className="relative p-2 rounded-lg hover:bg-gov-700 transition-colors cursor-pointer"
                >
                    <Bell size={18} className="text-gov-300" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center risk-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
};
