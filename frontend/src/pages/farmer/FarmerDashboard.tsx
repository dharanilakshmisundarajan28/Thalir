import React from 'react';
import { motion } from 'framer-motion';
import { CloudSun, Droplets, Wind, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FarmerDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Welcome back, get your farm updates.</p>
                </div>
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Weather Widget (Mock) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <CloudSun size={120} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-lg font-medium opacity-90">Current Weather</h2>
                        <div className="text-5xl font-bold mt-2">28°C</div>
                        <p className="opacity-90 mt-1">Partly Cloudy • Coimbatore, TN</p>
                    </div>
                    <div className="flex space-x-8">
                        <div className="text-center">
                            <div className="bg-white/20 p-3 rounded-full mb-2 mx-auto w-12 h-12 flex items-center justify-center">
                                <Droplets size={24} />
                            </div>
                            <div className="font-bold">65%</div>
                            <div className="text-xs opacity-75">Humidity</div>
                        </div>
                        <div className="text-center">
                            <div className="bg-white/20 p-3 rounded-full mb-2 mx-auto w-12 h-12 flex items-center justify-center">
                                <Wind size={24} />
                            </div>
                            <div className="font-bold">12 km/h</div>
                            <div className="text-xs opacity-75">Wind Speed</div>
                        </div>
                        <div className="text-center">
                            <div className="bg-white/20 p-3 rounded-full mb-2 mx-auto w-12 h-12 flex items-center justify-center">
                                <CloudSun size={24} />
                            </div>
                            <div className="font-bold">0%</div>
                            <div className="text-xs opacity-75">Precipitation</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions & Stats */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* Alert Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-xl border border-red-100 shadow-sm"
                >
                    <div className="flex items-center space-x-2 mb-4 text-red-600">
                        <AlertTriangle size={24} />
                        <h3 className="font-bold text-lg">Alerts</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="bg-red-50 p-3 rounded-lg text-sm border-l-4 border-red-500">
                            <span className="font-bold block text-red-700">Heavy Rain Warning</span>
                            Expected in 2 days. Secure your harvest.
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-lg text-sm border-l-4 border-yellow-500">
                            <span className="font-bold block text-yellow-700">Pest Alert</span>
                            Blight risk elevated due to humidity.
                        </div>
                    </div>
                </motion.div>

                {/* Market Insight */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                >
                    <div className="flex items-center space-x-2 mb-4 text-green-600">
                        <TrendingUp size={24} />
                        <h3 className="font-bold text-lg">Market Trends</h3>
                    </div>
                    <ul className="space-y-3">
                        <li className="flex justify-between items-center pb-2 border-b border-gray-50">
                            <span className="text-gray-600">Tomato</span>
                            <span className="font-bold text-green-600">₹45/kg <span className="text-xs">▲5%</span></span>
                        </li>
                        <li className="flex justify-between items-center pb-2 border-b border-gray-50">
                            <span className="text-gray-600">Onion</span>
                            <span className="font-bold text-red-500">₹30/kg <span className="text-xs">▼2%</span></span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="text-gray-600">Potato</span>
                            <span className="font-bold text-gray-700">₹22/kg <span className="text-xs">-</span></span>
                        </li>
                    </ul>
                    <Link to="/farmer/mandi" className="block mt-4 text-center text-sm text-green-600 font-medium hover:underline">
                        View Full Market Data
                    </Link>
                </motion.div>

                {/* Recommended Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center text-center"
                >
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Start New Crop Cycle?</h3>
                    <p className="text-sm text-gray-500 mb-6">Get AI-powered recommendations for your land.</p>
                    <Link to="/farmer/crop-recommend">
                        <button className="bg-green-600 text-white px-6 py-3 rounded-lg w-full font-medium shadow-md hover:bg-green-700 transition">
                            Recommend Crop
                        </button>
                    </Link>
                </motion.div>
            </div>

        </div>
    );
};

export default FarmerDashboard;
