import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AppShell } from '../components/layout/AppShell';
import Login from '../pages/Login';
import DistrictOfficerLogin from '../pages/DistrictOfficerLogin';
import BlockOfficerLogin from '../pages/BlockOfficerLogin';
import SchoolAdminLogin from '../pages/SchoolAdminLogin';
import DistrictOfficerRegister from '../pages/DistrictOfficerRegister';
import BlockOfficerRegister from '../pages/BlockOfficerRegister';
import SchoolAdminRegister from '../pages/SchoolAdminRegister';
import Dashboard from '../pages/Dashboard';
import DistrictOverview from '../pages/DistrictOverview';
import SchoolDetail from '../pages/SchoolDetail';
import OptimizationCenter from '../pages/OptimizationCenter';
import SimulationLab from '../pages/SimulationLab';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
    children,
    allowedRoles,
}) => {
    const { isAuthenticated, user } = useAuthStore();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/login/district-officer" element={<DistrictOfficerLogin />} />
                <Route path="/login/block-officer" element={<BlockOfficerLogin />} />
                <Route path="/login/school-admin" element={<SchoolAdminLogin />} />
                <Route path="/register/district-officer" element={<DistrictOfficerRegister />} />
                <Route path="/register/block-officer" element={<BlockOfficerRegister />} />
                <Route path="/register/school-admin" element={<SchoolAdminRegister />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AppShell />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route
                        path="district"
                        element={
                            <ProtectedRoute allowedRoles={['district_officer', 'block_officer']}>
                                <DistrictOverview />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="school/:schoolId" element={<SchoolDetail />} />
                    <Route
                        path="optimization"
                        element={
                            <ProtectedRoute allowedRoles={['district_officer']}>
                                <OptimizationCenter />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="simulation"
                        element={
                            <ProtectedRoute allowedRoles={['district_officer', 'block_officer']}>
                                <SimulationLab />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
