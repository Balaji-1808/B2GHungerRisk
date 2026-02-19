import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Settings as SettingsIcon, User, Shield, Bell, Palette, Database, Globe, Sun, Moon } from 'lucide-react';

const Settings: React.FC = () => {
    const { user } = useAuthStore();
    const { mode, setMode } = useThemeStore();

    // Apply theme on mount
    useEffect(() => {
        setMode(mode);
    }, [mode, setMode]);

    const settingSections = [
        {
            title: 'Profile',
            icon: <User size={18} />,
            items: [
                { label: 'Display Name', value: user?.name || 'User', type: 'text' as const },
                { label: 'Role', value: user?.role.replace('_', ' ') || 'N/A', type: 'text' as const },
                { label: 'Block/School', value: user?.block || user?.schoolId || 'District Level', type: 'text' as const },
            ],
        },
        {
            title: 'Security',
            icon: <Shield size={18} />,
            items: [
                { label: 'Two-Factor Authentication', value: 'Enabled', type: 'toggle' as const, enabled: true },
                { label: 'Session Timeout', value: '30 min', type: 'text' as const },
            ],
        },
        {
            title: 'Notifications',
            icon: <Bell size={18} />,
            items: [
                { label: 'High-Risk Alerts', value: 'Enabled', type: 'toggle' as const, enabled: true },
                { label: 'Cascade Warnings', value: 'Enabled', type: 'toggle' as const, enabled: true },
                { label: 'Email Digest', value: 'Daily', type: 'text' as const },
            ],
        },
        {
            title: 'Data',
            icon: <Database size={18} />,
            items: [
                { label: 'Data Source', value: 'Mock / Simulated', type: 'text' as const },
                { label: 'Last Data Sync', value: new Date().toLocaleString('en-IN'), type: 'text' as const },
            ],
        },
        {
            title: 'System',
            icon: <Globe size={18} />,
            items: [
                { label: 'Version', value: '1.0.0-beta', type: 'text' as const },
                { label: 'API Status', value: 'Healthy', type: 'text' as const },
                { label: 'Model Version', value: 'DTv1.2-forecast', type: 'text' as const },
            ],
        },
    ];

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-3">
                <SettingsIcon size={22} className="text-accent-light" />
                <div>
                    <h2 className="text-lg font-bold text-gov-50">Settings</h2>
                    <p className="text-xs text-gov-400">System configuration and user preferences</p>
                </div>
            </div>

            {/* Theme Settings - Featured Section */}
            <div className="glass-card p-5 fade-up">
                <h3 className="text-sm font-semibold text-gov-50 mb-4 flex items-center gap-2">
                    <span className="text-accent-light"><Palette size={18} /></span>
                    Appearance
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs text-gov-300">Theme Mode</span>
                            <p className="text-[10px] text-gov-500 mt-0.5">
                                Choose between light and dark theme
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setMode('light')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                    mode === 'light'
                                        ? 'bg-accent text-white'
                                        : 'bg-gov-700 text-gov-400 hover:bg-gov-600'
                                }`}
                                title="Light Mode"
                            >
                                <Sun size={16} />
                                <span className="text-xs font-medium">Light</span>
                            </button>
                            <button
                                onClick={() => setMode('dark')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                    mode === 'dark'
                                        ? 'bg-accent text-white'
                                        : 'bg-gov-700 text-gov-400 hover:bg-gov-600'
                                }`}
                                title="Dark Mode"
                            >
                                <Moon size={16} />
                                <span className="text-xs font-medium">Dark</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-t border-gov-700/50">
                        <span className="text-xs text-gov-300">Risk Threshold (High)</span>
                        <span className="text-xs text-gov-100 font-medium">70%</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gov-700/50">
                        <span className="text-xs text-gov-300">Dashboard Auto-Refresh</span>
                        <span className="text-xs text-gov-100 font-medium">5 min</span>
                    </div>
                </div>
            </div>

            {settingSections.map((section) => (
                <div key={section.title} className="glass-card p-5 fade-up">
                    <h3 className="text-sm font-semibold text-gov-50 mb-4 flex items-center gap-2">
                        <span className="text-accent-light">{section.icon}</span>
                        {section.title}
                    </h3>
                    <div className="space-y-3">
                        {section.items.map((item) => (
                            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gov-700/50 last:border-0">
                                <span className="text-xs text-gov-300">{item.label}</span>
                                {item.type === 'toggle' ? (
                                    <div 
                                        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
                                            item.enabled ? 'bg-emerald-500' : 'bg-gov-600'
                                        }`}
                                    >
                                        <div 
                                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                                                item.enabled ? 'left-5' : 'left-0.5'
                                            }`} 
                                        />
                                    </div>
                                ) : (
                                    <span className="text-xs text-gov-100 font-medium">{item.value}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Settings;
