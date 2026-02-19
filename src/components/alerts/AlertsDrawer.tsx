import React from 'react';
import { X, AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useNavigate } from 'react-router-dom';

export const AlertsDrawer: React.FC = () => {
    const { alerts, alertDrawerOpen, toggleAlertDrawer, markAlertRead } = useAppStore();
    const navigate = useNavigate();

    if (!alertDrawerOpen) return null;

    const severityIcon = (sev: string) => {
        switch (sev) {
            case 'critical': return <AlertTriangle size={16} className="text-red-400" />;
            case 'warning': return <AlertCircle size={16} className="text-amber-400" />;
            default: return <Info size={16} className="text-blue-400" />;
        }
    };

    const severityBg = (sev: string) => {
        switch (sev) {
            case 'critical': return 'border-l-red-500 bg-red-500/5';
            case 'warning': return 'border-l-amber-500 bg-amber-500/5';
            default: return 'border-l-blue-500 bg-blue-500/5';
        }
    };

    const handleClick = (alertId: string, schoolId?: string) => {
        markAlertRead(alertId);
        if (schoolId) {
            navigate(`/school/${schoolId}`);
            toggleAlertDrawer();
        }
    };

    const unreadCount = alerts.filter((a) => !a.read).length;
    const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
    const cascadeCount = alerts.filter((a) => a.category === 'cascade').length;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 z-50" onClick={toggleAlertDrawer} />

            {/* Drawer */}
            <div className="fixed right-0 top-0 bottom-0 w-96 bg-gov-800 border-l border-gov-600 z-50 slide-in-right flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gov-600 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-gov-50">Alerts & Warnings</h3>
                        <p className="text-xs text-gov-400 mt-0.5">{unreadCount} unread · {criticalCount} critical · {cascadeCount} cascade</p>
                    </div>
                    <button onClick={toggleAlertDrawer} className="p-1.5 rounded-lg hover:bg-gov-700 transition-colors cursor-pointer">
                        <X size={16} className="text-gov-400" />
                    </button>
                </div>

                {/* Alert list */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {alerts.map((alert) => (
                        <button
                            key={alert.id}
                            onClick={() => handleClick(alert.id, alert.schoolId)}
                            className={`w-full text-left p-3 rounded-lg border-l-4 cursor-pointer transition-all hover:translate-x-1 ${severityBg(alert.severity)} ${alert.read ? 'opacity-50' : ''
                                }`}
                        >
                            <div className="flex items-start gap-2">
                                {severityIcon(alert.severity)}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gov-100 truncate">{alert.title}</p>
                                    <p className="text-[11px] text-gov-400 mt-1 line-clamp-2">{alert.message}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[10px] text-gov-500">
                                            {new Date(alert.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {alert.schoolId && (
                                            <span className="text-[10px] text-accent-light flex items-center gap-0.5">
                                                View <ChevronRight size={10} />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};
