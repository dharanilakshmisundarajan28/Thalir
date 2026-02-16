import {
    Search,
    Filter,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    ExternalLink
} from 'lucide-react';

const RecentOrdersTable = () => {
    const orders = [
        { id: '#ORD-9021', name: 'Rajesh Kumar', date: 'Oct 24, 2023', amount: '₹14,500', status: 'Pending', color: 'amber' },
        { id: '#ORD-9018', name: 'Senthil Murugan', date: 'Oct 23, 2023', amount: '₹8,200', status: 'Paid', color: 'emerald' },
        { id: '#ORD-9015', name: 'Anjali Sharma', date: 'Oct 22, 2023', amount: '₹22,100', status: 'Completed', color: 'blue' },
        { id: '#ORD-9012', name: 'Vijay Pratap', date: 'Oct 21, 2023', amount: '₹11,400', status: 'Failed', color: 'rose' },
        { id: '#ORD-8998', name: 'Muthu Swamy', date: 'Oct 20, 2023', amount: '₹5,600', status: 'Paid', color: 'emerald' },
    ];

    const statusStyles: Record<string, string> = {
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        rose: 'bg-rose-50 text-rose-600 border-rose-100',
    };

    return (
        <div className="bg-white rounded-[24px] shadow-soft border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Filter orders..."
                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100 hover:bg-emerald-100 transition-all group">
                        View All
                        <ExternalLink size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Farmer Name</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                            <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group cursor-default">
                                <td className="px-8 py-5 text-sm font-bold text-emerald-600">{order.id}</td>
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 flex items-center justify-center text-[12px] font-extrabold border border-emerald-200 transition-transform group-hover:scale-110">
                                                {order.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-gray-800 tracking-tight">{order.name}</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Premium Farmer</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-sm font-semibold text-gray-500">{order.date}</td>
                                <td className="px-8 py-5 text-sm font-bold text-gray-800">{order.amount}</td>
                                <td className="px-8 py-5">
                                    <div className="flex justify-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-extrabold border ${statusStyles[order.color]}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button className="p-2 text-gray-300 hover:text-emerald-500 transition-colors hover:bg-emerald-50 rounded-lg">
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-6 bg-gray-50/30 flex justify-between items-center border-t border-gray-50">
                <span className="text-[12px] font-bold text-gray-400 italic">Showing 5 of 42 orders</span>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-400 cursor-not-allowed">Previous</button>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-colors">Next</button>
                </div>
            </div>
        </div>
    );
};

export default RecentOrdersTable;
