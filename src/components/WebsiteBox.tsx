import React, { useState } from 'react';
import type { WebsiteBox as WebsiteBoxType } from '../types';

interface WebsiteBoxProps {
    box: WebsiteBoxType;
    onRemove: (id: string) => void;
}

// Add webview type definition for TS
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'webview': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { src?: string; partition?: string; allow?: string }, HTMLElement>;
        }
    }
}

// Simplified for Rnd context (dimensions handled by parent)
export const WebsiteBox: React.FC<WebsiteBoxProps> = ({ box, onRemove }) => {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = (e: React.MouseEvent) => {
        e.stopPropagation();
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="w-full h-full bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/5 shadow-lg group hover:border-blue-500/30 transition-shadow duration-300 hover:shadow-blue-900/10 hover:shadow-2xl flex flex-col">
            {/* Header - Drag Handle */}
            <div className="flex items-center justify-between h-9 bg-black/40 px-3 cursor-move border-b border-white/5 drag-handle relative">
                <div className="flex items-center gap-2 overflow-hidden z-10">
                    <div className="w-2 h-2 rounded-full bg-blue-500/50"></div>
                </div>

                {/* Centered Title */}
                <div className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xs font-medium text-gray-300 truncate tracking-wide select-none max-w-[50%] opacity-90">
                        {box.title || box.url}
                    </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/20 rounded-lg backdrop-blur-sm">
                    <button
                        onClick={handleRefresh}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="text-gray-500 hover:text-green-400 p-1 hover:bg-white/5 rounded-md transition-colors cursor-pointer"
                        title="Refresh"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(box.url, '_blank');
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="text-gray-500 hover:text-blue-400 p-1 hover:bg-white/5 rounded-md transition-colors cursor-pointer"
                        title="Open in New Tab"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(box.id);
                        }}
                        onMouseDown={(e) => e.stopPropagation()} // Prevent drag start on click
                        className="text-gray-500 hover:text-red-400 p-1 hover:bg-white/5 rounded-md transition-colors cursor-pointer"
                        title="Remove"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 w-full relative bg-white">
                {/* Overlay to capture clicks during drag/resize if needed, usually Rnd handles this but simple iframe interaction is tricky with dnd */}
                <iframe
                    key={refreshKey}
                    src={box.url}
                    className="w-full h-full border-0"
                    title={box.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
            </div>
        </div>
    );
};
