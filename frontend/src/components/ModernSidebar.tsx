import {
    ShoppingCart,
    Leaf,
    LineChart,
    Package,
    Settings,
    ChevronLeft,
    ChevronRight,
    Sprout
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const ModernSidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
    const menuItems = [
        { name: 'Orders', icon: <ShoppingCart size={22} />, path: '/farmer/orders' },
        { name: 'Crop Recommendation', icon: <Leaf size={22} />, path: '/farmer/crop-recommendation' },
        { name: 'Mandi Price', icon: <LineChart size={22} />, path: '/farmer/mandi-price' },
        { name: 'Product Management', icon: <Package size={22} />, path: '/farmer/products' },
        { name: 'Settings', icon: <Settings size={22} />, path: '/farmer/settings' },
    ];

    return (
        <aside
            className={`bg-white border-r border-gray-100 h-screen transition-all duration-300 flex flex-col z-50 relative shadow-soft ${collapsed ? 'w-20' : 'w-[260px]'}`}
        >
            {/* Logo Section */}
            <div className="h-20 flex items-center px-6 mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-[14px] text-white shadow-lg shadow-emerald-200 shrink-0 transform transition-transform hover:scale-110">
                        <Sprout size={24} />
                    </div>
                    {!collapsed && (
                        <span className="font-extrabold text-xl text-gray-900 tracking-tight">THALIR</span>
                    )}
                </div>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 bg-white border border-gray-100 rounded-full p-1.5 text-gray-400 hover:text-emerald-500 shadow-3d z-50 transition-all hover:scale-110 active:scale-95"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 space-y-4 overflow-y-auto custom-scrollbar pt-2">
                {menuItems.map((item) => (
                    <div key={item.path} className="relative group">
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-4 px-4 py-3.5 rounded-[14px] transition-all duration-300 relative
                                ${isActive
                                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lift border border-emerald-400 ring-1 ring-emerald-400/20'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-emerald-600 shadow-sm border border-transparent hover:border-gray-100 font-medium'}
                                transform hover:-translate-y-[2px] active:scale-[0.98]
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={`shrink-0 transition-transform duration-300 ${collapsed ? 'mx-auto' : ''} ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        {item.icon}
                                    </div>
                                    {!collapsed && (
                                        <span className={`text-[15px] tracking-tight ${isActive ? 'font-bold' : 'font-semibold'}`}>
                                            {item.name}
                                        </span>
                                    )}
                                    {/* Active Inset Glow Effect */}
                                    {isActive && (
                                        <div className="absolute inset-0 rounded-[14px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] pointer-events-none"></div>
                                    )}
                                </>
                            )}
                        </NavLink>

                        {/* Tooltip for collapsed state */}
                        {collapsed && (
                            <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[60] shadow-xl translate-x-1 group-hover:translate-x-0">
                                {item.name}
                                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900"></div>
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Footer / Info Card (Only when not collapsed) */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="p-6 pt-0"
                    >
                        <div className="bg-gray-50/50 rounded-[18px] p-4 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Market Insights</p>
                            </div>
                            <p className="text-[13px] font-bold text-gray-800 leading-tight">Urea prices down 5% today in your region.</p>
                            <button className="mt-3 w-full bg-white border border-gray-200 py-1.5 rounded-xl text-[11px] font-bold text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-sm">
                                View Report
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </aside>
    );
};

export default ModernSidebar;
