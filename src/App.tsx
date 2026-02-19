import React, { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => {
    const { mode, setMode } = useThemeStore();

    useEffect(() => {
        // Initialize theme on app load
        setMode(mode);
    }, [mode, setMode]);

    return <AppRoutes />;
};

export default App;
