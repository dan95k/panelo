import React from 'react';

interface PlaceholderBoxProps {
    onClick?: () => void;
}

export const PlaceholderBox: React.FC<PlaceholderBoxProps> = () => {
    return (
        <div
            className="flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl h-[300px] w-full bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-default select-none group"
        >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                <svg className="text-gray-500 group-hover:text-blue-400 transition-colors" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
            <span className="text-gray-500 font-medium text-sm group-hover:text-gray-300 transition-colors">Add new website</span>
        </div>
    );
};
