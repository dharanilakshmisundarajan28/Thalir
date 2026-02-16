import { Calendar, ChevronDown, MoreHorizontal } from 'lucide-react';

const StatisticsBarChart = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [
        { apps: 60, short: 40, rej: 10, hold: 5 },
        { apps: 50, short: 30, rej: 15, hold: 10 },
        { apps: 70, short: 50, rej: 12, hold: 8 },
        { apps: 55, short: 35, rej: 20, hold: 5 },
        { apps: 65, short: 45, rej: 10, hold: 12 },
        { apps: 75, short: 55, rej: 8, hold: 10 },
        { apps: 60, short: 42, rej: 15, hold: 7 },
    ];

    return (
        <div className="bg-white p-8 rounded-[32px] shadow-soft border border-gray-50 h-full flex flex-col">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <h3 className="text-[18px] font-bold text-gray-900">Statistics of Active Applications</h3>
                    <div className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl flex items-center gap-2 text-[12px] font-bold cursor-pointer">
                        <Calendar size={14} />
                        Week
                        <ChevronDown size={14} />
                    </div>
                </div>
                <button className="text-gray-300 hover:text-gray-500">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="flex-1 mt-4 relative">
                {/* Y-Axis Labels */}
                <div className="absolute left-0 h-full flex flex-col justify-between text-[10px] font-bold text-gray-300 pointer-events-none pb-8">
                    <span>100%</span>
                    <span>80%</span>
                    <span>60%</span>
                    <span>40%</span>
                    <span>20%</span>
                </div>

                {/* Bars */}
                <div className="ml-10 h-full flex justify-between items-end pb-8">
                    {data.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-4 flex-1">
                            <div className="w-1.5 bg-gray-50 rounded-full h-48 relative flex flex-col-reverse overflow-hidden">
                                <div className="w-full bg-indigo-500" style={{ height: `${item.apps}%` }}></div>
                                <div className="w-full bg-amber-400 absolute bottom-0" style={{ height: `${item.short}%` }}></div>
                                <div className="w-full bg-rose-400 absolute bottom-0" style={{ height: `${item.rej}%` }}></div>
                                <div className="w-full bg-indigo-200 absolute bottom-0" style={{ height: `${item.hold}%` }}></div>
                            </div>
                            <span className="text-[11px] font-bold text-gray-400">{days[idx]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Applications</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Shortlisted</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Rejected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-100"></div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase">On Hold</span>
                </div>
            </div>
        </div>
    );
};

export default StatisticsBarChart;
