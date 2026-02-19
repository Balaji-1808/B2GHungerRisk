import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AlertsDrawer } from '../alerts/AlertsDrawer';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';

export const AppShell: React.FC = () => {
    const init = useAppStore((s) => s.init);
    const userDistrict = useAuthStore((s) => s.userDistrict);

    useEffect(() => {
        init(userDistrict);
    }, [init, userDistrict]);

    return (
        <div className="min-h-screen bg-gov-900">
            <Sidebar />
            <Topbar />
            <main className="ml-64 pt-14 min-h-screen">
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
            <AlertsDrawer />
        </div>
    );
};
