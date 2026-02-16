import { Outlet, Link, Navigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Sprout } from 'lucide-react';
import AuthService from '../services/auth.service';

const ConsumerLayout = () => {
    const user = AuthService.getCurrentUser();

    // Guard: Redirect to landing page if no user or incorrect role
    if (!user || !user.roles.includes("ROLE_CONSUMER")) {
        return <Navigate to="/" replace />;
    }

    const handleLogout = () => {
        AuthService.logout();
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">

                        {/* Logo */}
                        <div className="flex items-center">
                            <Link to="/consumer/home" className="flex-shrink-0 flex items-center">
                                <Sprout className="h-8 w-8 text-green-600 mr-2" />
                                <span className="text-2xl font-bold text-gray-900">THALIR <span className="text-green-600">Fresh</span></span>
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex flex-1 items-center justify-center px-8">
                            <div className="w-full max-w-lg relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 sm:text-sm transition duration-150 ease-in-out"
                                    placeholder="Search for fresh fruits, vegetables..."
                                />
                            </div>
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center space-x-4">
                            <Link to="/consumer/cart" className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-green-600 relative">
                                <ShoppingCart className="h-6 w-6" />
                                <span className="absolute top-1 right-1 h-4 w-4 bg-green-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">2</span>
                            </Link>

                            <div className="relative group">
                                <button className="flex items-center space-x-2 p-2 rounded-full text-gray-500 hover:bg-gray-100">
                                    <User className="h-6 w-6" />
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-in-out">
                                    <div className="px-4 py-3">
                                        <p className="text-sm leading-5">Signed in as</p>
                                        <p className="text-sm font-medium leading-5 text-gray-900 truncate">{user?.username}</p>
                                    </div>
                                    <div className="py-1">
                                        <Link to="/consumer/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                                    </div>
                                    <div className="py-1">
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100">Sign out</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">&copy; 2026 THALIR. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default ConsumerLayout;
