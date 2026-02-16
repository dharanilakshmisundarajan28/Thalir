import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Package, BarChart, ShoppingCart, LogOut, Sprout } from 'lucide-react';
import AuthService from '../services/auth.service';

const ProviderLayout = () => {
    const location = useLocation();
    const user = AuthService.getCurrentUser();

    // Guard: Redirect to landing page if no user or incorrect role
    if (!user || !user.roles.includes("ROLE_PROVIDER")) {
        return <Navigate to="/" replace />;
    }

    const handleLogout = () => {
        AuthService.logout();
        window.location.href = '/';
    };

    const navItems = [
        { name: 'Dashboard', path: '/provider/dashboard', icon: <BarChart size={20} /> },
        { name: 'Inventory', path: '/provider/inventory', icon: <Package size={20} /> },
        { name: 'Orders', path: '/provider/orders', icon: <ShoppingCart size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <Sprout className="h-8 w-8 text-blue-600 mr-2" />
                    <span className="text-xl font-bold text-gray-800">THALIR <span className="text-blue-600 text-sm block">Provider</span></span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="mb-4 px-2">
                        <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                        <p className="text-xs text-gray-500">Fertilizer Provider</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg">
                        <LogOut size={16} className="mr-2" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default ProviderLayout;
