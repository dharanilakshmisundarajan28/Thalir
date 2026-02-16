import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Package,
} from 'lucide-react';

const KPICardGrid = () => {
    const kpis = [
        {
            label: 'Total Revenue',
            value: '₹4,25,000',
            growth: '+12.5%',
            isPositive: true,
            icon: <DollarSign className="text-emerald-500" size={24} />,
            bg: 'bg-emerald-50'
        },
        {
            label: 'Pending Orders',
            value: '142',
            growth: '+8.2%',
            isPositive: true,
            icon: <ShoppingCart className="text-blue-500" size={24} />,
            bg: 'bg-blue-50'
        },
        {
            label: 'Active Vendors',
            value: '12',
            growth: '-2.4%',
            isPositive: false,
            icon: <Users className="text-purple-500" size={24} />,
            bg: 'bg-purple-50'
        },
        {
            label: 'Total Products',
            value: '84',
            growth: '+15.3%',
            isPositive: true,
            icon: <Package className="text-amber-500" size={24} />,
            bg: 'bg-amber-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, idx) => (
                <div
                    key={idx}
                    className="bg-white p-6 rounded-[20px] shadow-soft border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow cursor-default group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`${kpi.bg} p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300`}>
                            {kpi.icon}
                        </div>
                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${kpi.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {kpi.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {kpi.growth}
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-semibold mb-1">{kpi.label}</p>
                        <h3 className="text-2xl font-bold text-gray-800 tracking-tight">{kpi.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KPICardGrid;
