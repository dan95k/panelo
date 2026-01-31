import React, { useState } from 'react';

export const HomePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Redirect to Google search
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center bg-radial-gradient relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-3xl px-6">
                {/* Logo/Title */}
                <div className="text-center mb-12">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 transform transition-transform hover:scale-110 duration-300">
                        <span className="text-white font-bold text-5xl">P</span>
                    </div>
                    <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-100 via-indigo-200 to-purple-200 bg-clip-text text-transparent tracking-tight">
                        Panelo
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Your personal workspace hub
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="relative group">
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-2xl opacity-30 group-hover:opacity-60 blur-lg transition duration-500 animate-gradient-x"></div>
                    
                    {/* Search Box */}
                    <div className="relative flex items-center bg-[#1a1b26] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:border-white/20 transition-all">
                        {/* Search Icon */}
                        <div className="pl-6 text-gray-400 group-focus-within:text-blue-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                        </div>

                        {/* Input Field */}
                        <input
                            type="text"
                            className="w-full bg-transparent text-gray-100 pl-4 pr-4 py-6 focus:outline-none text-lg font-medium placeholder-gray-500"
                            placeholder="Search Google or enter URL..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />

                        {/* Search Button */}
                        <button
                            type="submit"
                            className="m-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            <span>Search</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>
                </form>

                {/* Quick Tips */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        <span className="inline-block mr-6">
                            <kbd className="px-2 py-1 bg-gray-800/50 border border-gray-700 rounded text-xs">Enter</kbd> to search
                        </span>
                        <span className="inline-block">
                            Use the sidebar to access your dashboards →
                        </span>
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="mt-16 grid grid-cols-3 gap-4">
                    <div className="glass-panel p-6 rounded-xl text-center group hover:border-blue-500/30 transition-all cursor-default">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </div>
                        <h3 className="text-white font-semibold mb-1">Dashboards</h3>
                        <p className="text-gray-400 text-xs">Organize websites</p>
                    </div>

                    <div className="glass-panel p-6 rounded-xl text-center group hover:border-purple-500/30 transition-all cursor-default">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                            </svg>
                        </div>
                        <h3 className="text-white font-semibold mb-1">Drag & Drop</h3>
                        <p className="text-gray-400 text-xs">Customize layout</p>
                    </div>

                    <div className="glass-panel p-6 rounded-xl text-center group hover:border-green-500/30 transition-all cursor-default">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <h3 className="text-white font-semibold mb-1">Fast Access</h3>
                        <p className="text-gray-400 text-xs">Instant switching</p>
                    </div>
                </div>
            </div>

            {/* Gradient Animation */}
            <style>{`
                @keyframes gradient-x {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }
            `}</style>
        </div>
    );
};
