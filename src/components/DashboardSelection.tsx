import React, { useState } from 'react';
import type { Dashboard } from '../types';

interface DashboardSelectionProps {
    dashboards: Dashboard[];
    onSelectDashboard: (dashboardId: string) => void;
    onCreateDashboard: (name: string) => void;
    onDeleteDashboard: (id: string, e: React.MouseEvent) => void;
}

export const DashboardSelection: React.FC<DashboardSelectionProps> = ({
    dashboards,
    onSelectDashboard,
    onCreateDashboard,
    onDeleteDashboard
}) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newDashboardName, setNewDashboardName] = useState('');

    const handleCreateDashboard = () => {
        if (newDashboardName.trim()) {
            onCreateDashboard(newDashboardName.trim());
            setShowCreateModal(false);
            setNewDashboardName('');
        }
    };
    return (
        <div className="min-h-screen w-full bg-radial-gradient flex items-center justify-center p-6">
            <div className="w-full max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
                        <span className="text-white font-bold text-4xl">P</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-100 to-indigo-200 bg-clip-text text-transparent">
                        Welcome to Panelo
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Choose a dashboard to continue, or create a new one
                    </p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {dashboards.map(dashboard => (
                        <div
                            key={dashboard.id}
                            onClick={() => onSelectDashboard(dashboard.id)}
                            className="group relative bg-[#1a1b26]/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-900/10 hover:scale-105 hover:bg-[#1a1b26]/60"
                        >
                            {/* Dashboard Icon */}
                            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-all">
                                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </div>

                            {/* Dashboard Name */}
                            <h3 className="text-xl font-semibold text-white text-center mb-2">
                                {dashboard.name}
                            </h3>

                            {/* Website Count */}
                            <p className="text-gray-400 text-center text-sm mb-4">
                                {dashboard.boxes.length} website{dashboard.boxes.length !== 1 ? 's' : ''}
                            </p>

                            {/* Preview Thumbnails */}
                            <div className="flex flex-wrap gap-2 justify-center mb-4">
                                {dashboard.boxes.slice(0, 3).map((box) => (
                                    <div
                                        key={box.id}
                                        className="w-12 h-8 bg-gray-700/50 rounded border border-white/10 flex items-center justify-center"
                                        title={box.title || box.url}
                                    >
                                        <div className="w-2 h-2 bg-blue-400/60 rounded-full"></div>
                                    </div>
                                ))}
                                {dashboard.boxes.length > 3 && (
                                    <div className="w-12 h-8 bg-gray-700/50 rounded border border-white/10 flex items-center justify-center">
                                        <span className="text-xs text-gray-400">+{dashboard.boxes.length - 3}</span>
                                    </div>
                                )}
                            </div>

                            {/* Delete Button */}
                            {dashboards.length > 1 && (
                                <button
                                    onClick={(e) => onDeleteDashboard(dashboard.id, e)}
                                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Delete Dashboard"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}

                            {/* Hover Effect Overlay */}
                            <div className="absolute inset-0 bg-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>
                    ))}

                    {/* Create New Dashboard Card */}
                    <div
                        onClick={() => setShowCreateModal(true)}
                        className="group bg-[#1a1b26]/20 backdrop-blur-sm border-2 border-dashed border-white/10 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-900/10 hover:scale-105 hover:bg-[#1a1b26]/40 flex flex-col items-center justify-center min-h-[280px]"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center group-hover:from-green-500/30 group-hover:to-emerald-600/30 transition-all">
                            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white text-center mb-2">
                            Create New Dashboard
                        </h3>
                        <p className="text-gray-400 text-center text-sm">
                            Start fresh with a new workspace
                        </p>
                    </div>
                </div>

                {/* Create Dashboard Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="w-full max-w-md bg-[#1a1b26] border border-white/10 rounded-xl shadow-2xl p-6 transform transition-all scale-100">
                            <h2 className="text-xl font-bold text-white mb-2">Create New Dashboard</h2>
                            <p className="text-gray-400 text-sm mb-6">Give your new workspace a name to get started.</p>

                            <input
                                type="text"
                                value={newDashboardName}
                                onChange={(e) => setNewDashboardName(e.target.value)}
                                placeholder="e.g., Work, Personal, Research..."
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all mb-6"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleCreateDashboard()}
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateDashboard}
                                    disabled={!newDashboardName.trim()}
                                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Create Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};