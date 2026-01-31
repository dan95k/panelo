import React, { useState, useEffect, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
// @ts-ignore
import * as ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { WebsiteBox } from './WebsiteBox';
import { AIChat } from './AIChat';
import type { WebsiteBox as WebsiteBoxType, Dashboard as DashboardType } from '../types';
import { fetchPageTitle } from '../services/metadata';

// Robust import for Responsive component, WidthProvider is skipped as we'll do it manually
// @ts-ignore
const RGL = ReactGridLayout.default || ReactGridLayout;
// @ts-ignore
const Responsive = ReactGridLayout.Responsive || RGL.Responsive;

interface DashboardProps {
    dashboards: DashboardType[];
    setDashboards: Dispatch<SetStateAction<DashboardType[]>>;
    activeDashboardId: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ dashboards, setDashboards, activeDashboardId }) => {
    // Derived state for the active boxes
    const activeDashboard = dashboards.find(d => d.id === activeDashboardId);
    const boxes = activeDashboard?.boxes || [];

    const [error, setError] = useState<string | null>(null);

    // Custom WidthProvider logic
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
    if (!Responsive) {
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
        <div className="w-full h-full flex flex-col relative overflow-hidden bg-radial-gradient">
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
    );
};
