import { Calendar, ChevronDown, MoreHorizontal } from 'lucide-react';

const AcquisitionsCard = () => {
    const data = [
        { label: 'Applications', value: 80, color: '#6366F1' },
        { label: 'Shortlisted', value: 55, color: '#F59E0B' },
        { label: 'Rejected', value: 47, color: '#EF4444' },
        { label: 'On Hold', value: 35, color: '#818CF8' },
        { label: 'Finalised', value: 24, color: '#10B981' },
    ];

    return (
        <div className="bg-white p-8 rounded-[32px] shadow-soft border border-gray-50 h-full flex flex-col">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <h3 className="text-[18px] font-bold text-gray-900">Acquisitions</h3>
                    <div className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl flex items-center gap-2 text-[12px] font-bold cursor-pointer">
                        <Calendar size={14} />
                        Month
                        <ChevronDown size={14} />
                    </div>
                </div>
                <button className="text-gray-300 hover:text-gray-500">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="flex-1 space-y-8">
                {data.map((item, idx) => (
                    <div key={idx} className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-[14px] font-semibold text-gray-500">{item.label}</span>
                            </div>
                            <span className="text-[14px] font-bold text-gray-900">{item.value}%</span>
                        </div>
                        <div className="w-full bg-gray-50 rounded-full h-2 relative overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{
                                    width: `${item.value}%`,
                                    backgroundColor: item.color,
                                    boxShadow: `0 0 10px ${item.color}33`
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AcquisitionsCard;
