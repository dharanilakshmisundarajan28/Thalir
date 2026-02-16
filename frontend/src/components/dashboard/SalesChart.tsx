import { Calendar, ChevronDown, Filter } from 'lucide-react';

const SalesChart = () => {
    return (
        <div className="bg-white p-6 rounded-[24px] shadow-soft border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Sales Performance</h3>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">Revenue growth over time</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-gray-50 text-gray-500 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold cursor-pointer hover:bg-gray-100 transition-colors border border-gray-100">
                        <Calendar size={14} />
                        Last 6 Months
                        <ChevronDown size={14} />
                    </div>
                    <div className="p-2 text-gray-400 hover:text-emerald-500 cursor-pointer transition-colors">
                        <Filter size={18} />
                    </div>
                </div>
            </div>

            <div className="flex-1 mt-4 relative">
                {/* SVG Chart Placeholder with premium styling */}
                <svg viewBox="0 0 500 200" className="w-full h-full preserve-3d">
                    <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                        </linearGradient>
                        <filter id="dropshadow" height="130%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                            <feOffset dx="0" dy="4" result="offsetblur" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.3" />
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Grid lines */}
                    <line x1="0" y1="40" x2="500" y2="40" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="90" x2="500" y2="90" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="140" x2="500" y2="140" stroke="#f3f4f6" strokeWidth="1" />

                    {/* Area under the line */}
                    <path
                        d="M0,150 C50,140 100,160 150,120 S250,90 300,110 S400,130 500,80 L500,200 L0,200 Z"
                        fill="url(#lineGradient)"
                    />

                    {/* Smooth Curved Line */}
                    <path
                        d="M0,150 C50,140 100,160 150,120 S250,90 300,110 S400,130 500,80"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="4"
                        strokeLinecap="round"
                        filter="url(#dropshadow)"
                    />

                    {/* Data Points */}
                    <circle cx="150" cy="120" r="5" fill="#10B981" stroke="#fff" strokeWidth="2" className="cursor-pointer" />
                    <circle cx="300" cy="110" r="5" fill="#10B981" stroke="#fff" strokeWidth="2" className="cursor-pointer" />
                    <circle cx="500" cy="80" r="5" fill="#10B981" stroke="#fff" strokeWidth="2" className="cursor-pointer" />
                </svg>

                <div className="flex justify-between mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                </div>
            </div>
        </div>
    );
};

export default SalesChart;
