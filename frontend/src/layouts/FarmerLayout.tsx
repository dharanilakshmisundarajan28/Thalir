import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    Sprout,
    LayoutDashboard,
    CloudSun,
    TrendingUp,
    ShoppingCart,
    Package,
    MessageSquare,
    Bell,
    User,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import AuthService from '../services/auth.service';

const FarmerLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const user = AuthService.getCurrentUser();

    const navItems = [
        { name: 'Dashboard', path: '/farmer/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Crop Recommend', path: '/farmer/crop-recommend', icon: <Sprout size={20} /> },
        { name: 'Mandi Prices', path: '/farmer/mandi', icon: <TrendingUp size={20} /> },
        { name: 'Weather', path: '/farmer/weather', icon: <CloudSun size={20} /> },
        { name: 'Buy Fertilizers', path: '/farmer/fertilizers', icon: <ShoppingCart size={20} /> },
        { name: 'My Products', path: '/farmer/my-products', icon: <Package size={20} /> },
        { name: 'AI Assistant', path: '/farmer/chat', icon: <MessageSquare size={20} /> },
    ];

    const handleLogout = () => {
        AuthService.logout();
        window.location.href = '/login';
    };

    return (
        <div className="flex h-screen bg-gray-50">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-100">
                        <Sprout className="h-8 w-8 text-green-600 mr-2" />
                        <span className="text-xl font-bold text-gray-800">THALIR</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`
                    flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                                            ? 'bg-green-50 text-green-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'}
                  `}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile Summary */}
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center mb-4 px-2">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <LogOut size={16} className="mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center space-x-4 ml-auto">
                        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-gray-200 mx-2"></div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">Farmer Account</span>
                            <User size={20} className="text-gray-500" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default FarmerLayout;
