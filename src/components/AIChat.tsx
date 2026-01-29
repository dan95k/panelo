import React, { useState } from 'react';

interface AIChatProps {
    onCommand: (command: string) => Promise<void>;
    isProcessing: boolean;
}

export const AIChat: React.FC<AIChatProps> = ({ onCommand, isProcessing }) => {
    const [input, setInput] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isProcessing) return;

        await onCommand(input);
        setInput('');
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 p-6 z-50 pointer-events-none flex justify-center bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent pb-8">
            <form onSubmit={handleSubmit} className="w-full max-w-2xl pointer-events-auto relative group transform transition-all hover:-translate-y-1">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-50 group-hover:opacity-100 blur transition duration-500"></div>
                <div className="relative flex items-center bg-[#13141f] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    <div className="pl-4 text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                    </div>
                    <input
                        type="text"
                        className="w-full bg-transparent text-gray-100 pl-3 pr-12 py-4 focus:outline-none text-base font-medium placeholder-gray-500 placeholder-opacity-70"
                        placeholder="Enter website URL (e.g. google.com)..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isProcessing}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {isProcessing ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-2"></div>
                        ) : (
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="p-2 mr-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-0 disabled:scale-75 transition-all duration-200 shadow-lg shadow-blue-500/20"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};
