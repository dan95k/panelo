import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import * as ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { WebsiteBox } from './WebsiteBox';
import { AIChat } from './AIChat';
import type { WebsiteBox as WebsiteBoxType, Dashboard as DashboardType } from '../types';
import { storageService } from '../services/storage';
import { fetchPageTitle } from '../services/metadata';

// Robust import for Responsive component, WidthProvider is skipped as we'll do it manually
// @ts-ignore
const RGL = ReactGridLayout.default || ReactGridLayout;
// @ts-ignore
const Responsive = ReactGridLayout.Responsive || RGL.Responsive;

export const Dashboard: React.FC = () => {
    const [dashboards, setDashboards] = useState<DashboardType[]>([]);
    const [activeDashboardId, setActiveDashboardId] = useState<string>('default');

    // Derived state for the active boxes
    const activeDashboard = dashboards.find(d => d.id === activeDashboardId);
    const boxes = activeDashboard?.boxes || [];

    const [error, setError] = useState<string | null>(null);

    // Custom WidthProvider logic
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newDashboardName, setNewDashboardName] = useState('');
    const [containerWidth, setContainerWidth] = useState(1200);
    const containerRef = useRef<HTMLDivElement>(null);

    const MAX_BOXES = 15;

    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Load initial state
    useEffect(() => {
        storageService.getDashboards().then(loadedDashboards => {
            if (loadedDashboards.length === 0) {
                const defaultDashboard: DashboardType = {
                    id: 'default',
                    name: 'My Dashboard',
                    boxes: []
                };
                setDashboards([defaultDashboard]);
                setActiveDashboardId(defaultDashboard.id);
            } else {
                setDashboards(loadedDashboards);
                setActiveDashboardId(loadedDashboards[0].id);
            }
        });
    }, []);

    // Save state on change
    useEffect(() => {
        if (dashboards.length > 0) {
            storageService.saveDashboards(dashboards);
        }
    }, [dashboards]);

    const handleCreateDashboard = () => {
        if (newDashboardName.trim()) {
            const newDashboard: DashboardType = {
                id: crypto.randomUUID(),
                name: newDashboardName.trim(),
                boxes: []
            };
            setDashboards(prev => [...prev, newDashboard]);
            setActiveDashboardId(newDashboard.id);
            setShowCreateModal(false);
            setNewDashboardName('');
        }
    };

    const handleDeleteDashboard = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (dashboards.length <= 1) {
            setError("Cannot delete the last dashboard");
            return;
        }
        if (confirm("Delete this dashboard?")) {
            setDashboards(prev => prev.filter(d => d.id !== id));
            if (activeDashboardId === id) {
                setActiveDashboardId(dashboards[0].id === id ? dashboards[1].id : dashboards[0].id);
            }
        }
    };

    // Helper to update specific dashboard boxes
    const updateActiveDashboardBoxes = (newBoxes: WebsiteBoxType[] | ((prev: WebsiteBoxType[]) => WebsiteBoxType[])) => {
        setDashboards(prev => prev.map(d => {
            if (d.id === activeDashboardId) {
                const updatedBoxes = typeof newBoxes === 'function' ? newBoxes(d.boxes) : newBoxes;
                return { ...d, boxes: updatedBoxes };
            }
            return d;
        }));
    };

    const handleRemoveBox = (boxId: string) => {
        updateActiveDashboardBoxes(prev => prev.filter(b => b.id !== boxId));
    };

    const handleLayoutChange = (layout: any[]) => {
        // Sync layout changes (x, y, w, h) back to our boxes state
        setDashboards(prev => prev.map(d => {
            if (d.id === activeDashboardId) {
                const updatedBoxes = d.boxes.map(box => {
                    const layoutItem = layout.find((l: any) => l.i === box.id);
                    if (layoutItem) {
                        return {
                            ...box,
                            x: layoutItem.x,
                            y: layoutItem.y,
                            width: layoutItem.w,
                            height: layoutItem.h
                        };
                    }
                    return box;
                });
                return { ...d, boxes: updatedBoxes };
            }
            return d;
        }));
    };

    const handleAddUrl = async (input: string) => {
        if (!input.trim()) return;

        // Simple URL validation/formatting
        let url = input.trim();
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        try {
            await addBox(url, url);
        } catch (err) {
            console.error(err);
            setError('Failed to add website');
        }
    };

    const addBox = async (url: string, title: string) => {
        if (boxes.length >= MAX_BOXES) {
            setError('Maximum 15 boxes allowed');
            return;
        }

        // Try to fetch the real page title
        let finalTitle = title;
        try {
            // Fetch title (frontend service)
            finalTitle = await fetchPageTitle(url);
        } catch (e) {
            console.warn("Failed to fetch title", e);
        }

        const newBox: WebsiteBoxType = {
            id: crypto.randomUUID(),
            url,
            title: finalTitle,
            x: (boxes.length * 2) % 12, // simple staggering
            y: Infinity, // put at bottom
            width: 4, // 4 cols wide (out of 12)
            height: 4 // 4 rows high
        };

        updateActiveDashboardBoxes(prev => [...prev, newBox]);
    };

    // Generate layout based on boxes state
    const layout = boxes.map(box => ({
        i: box.id,
        x: box.x !== undefined ? box.x : 0,
        y: box.y !== undefined ? box.y : 0,
        w: box.width || 4,
        h: box.height || 4,
        minW: 2,
        minH: 2
    }));

    // Loading state for layout engine
    if (!Responsive) { // Changed from ResponsiveGridLayout to Responsive
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#1a1b26] text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400">Loading Layout Engine...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex overflow-hidden bg-radial-gradient relative">
            {/* Create Dashboard Modal */}
            {showCreateModal && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
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

            {/* Sidebar */}
            <div className="w-20 hover:w-64 group/sidebar h-full glass-panel border-r border-white/5 flex flex-col z-50 bg-black/20 backdrop-blur-xl transition-[width] duration-300 ease-in-out overflow-hidden">
                <div className="p-4 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-8 px-1">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <span className="text-white font-bold text-xl">D</span>
                        </div>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-100 to-indigo-200 bg-clip-text text-transparent tracking-tight whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 delay-100">
                            Panelo
                        </h1>
                    </div>

                    <div className="space-y-2">
                        {dashboards.map(dashboard => (
                            <div
                                key={dashboard.id}
                                onClick={() => setActiveDashboardId(dashboard.id)}
                                className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-all duration-200 ${activeDashboardId === dashboard.id
                                    ? 'bg-blue-500/20 text-blue-100 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                                    }`}
                                title={dashboard.name}
                            >
                                <div className="shrink-0 flex items-center justify-center w-6 h-6">
                                    <svg className={`w-5 h-5 transition-colors ${activeDashboardId === dashboard.id ? 'text-blue-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </div>
                                <span className="font-medium truncate text-sm whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">{dashboard.name}</span>

                                {dashboards.length > 1 && (
                                    <button
                                        onClick={(e) => handleDeleteDashboard(dashboard.id, e)}
                                        className="ml-auto opacity-0 group-hover/sidebar:opacity-100 p-1 hover:text-red-400 number-chart transition-opacity"
                                        title="Delete Dashboard"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 px-2">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="w-full flex items-center gap-3 py-2 rounded-lg text-gray-400 hover:text-blue-300 hover:bg-blue-500/5 transition-all text-sm font-medium overflow-hidden"
                            title="Create New Dashboard"
                        >
                            <div className="shrink-0 flex items-center justify-center w-6 h-6">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <span className="whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">New Dashboard</span>
                        </button>
                    </div>

                </div>

                <div className="mt-auto p-4 border-t border-white/5 overflow-hidden">
                    <div className="text-xs text-gray-500 whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 text-center">
                        {boxes.length} Active Window{boxes.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative h-full overflow-hidden">
                {/* Header for Active Actions */}
                <div className="absolute top-0 right-0 p-4 z-40 flex gap-2">
                    {/* Could add dashboard-specific settings here */}
                </div>

                {error && (
                    <div className="fixed top-6 right-6 bg-red-500/90 backdrop-blur text-white px-4 py-3 rounded-lg shadow-xl z-[60] border border-red-400/50 flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
                        <span className="text-sm font-medium">{error}</span>
                        <button onClick={() => setError(null)} className="opacity-80 hover:opacity-100">×</button>
                    </div>
                )}

                {/* Canvas Area */}
                <div ref={containerRef} className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden p-6 pt-16">
                    {!Responsive ? (
                        <div className="text-white p-4">Loading Layout Engine... (Library Error)</div>
                    ) : (
                        <Responsive
                            className="layout"
                            layouts={{ lg: layout }}
                            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                            rowHeight={50}
                            width={containerWidth}
                            onLayoutChange={(currentLayout: any) => handleLayoutChange(currentLayout)}
                            // @ts-ignore
                            draggableHandle=".drag-handle"
                            resizeHandle={undefined}
                            isDraggable={true}
                            isResizable={true}
                            compactType="vertical"
                            preventCollision={false}
                        >
                            {boxes.map(box => (
                                <div key={box.id} className="relative group">
                                    <WebsiteBox box={box} onRemove={handleRemoveBox} />
                                </div>
                            ))}
                        </Responsive>
                    )}
                </div>

                {/* URL Input Bar */}
                <AIChat
                    onCommand={handleAddUrl}
                    isProcessing={false}
                />

            </div>
        </div>
    );
};
