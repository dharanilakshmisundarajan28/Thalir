import { MoreHorizontal } from 'lucide-react';

const GenderChart = () => {
    return (
        <div className="bg-white p-8 rounded-[32px] shadow-soft border border-gray-50 h-full flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-8">
                <h3 className="text-[18px] font-bold text-gray-900">Candidates by Gender</h3>
                <button className="text-gray-300 hover:text-gray-500">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                {/* SVG Donut Chart */}
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#F3F4F6"
                        strokeWidth="12"
                        fill="transparent"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#6366F1"
                        strokeWidth="12"
                        strokeDasharray="251.2"
                        strokeDashoffset="62.8" /* 75% */
                        strokeLinecap="round"
                        fill="transparent"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#F87171"
                        strokeWidth="12"
                        strokeDasharray="251.2"
                        strokeDashoffset="200.96" /* 20% */
                        strokeLinecap="round"
                        fill="transparent"
                        className="transform rotate-[270deg]"
                        style={{ transformOrigin: '50% 50%' }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-bold text-gray-900">75%</span>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Male</span>
                </div>
            </div>

            <div className="flex gap-8 mt-auto px-4 w-full justify-center">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-[14px] font-bold text-gray-900">Male</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <span className="text-[14px] font-bold text-gray-900">Female</span>
                </div>
            </div>
        </div>
    );
};

export default GenderChart;
