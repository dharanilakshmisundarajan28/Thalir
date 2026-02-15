import { motion } from 'framer-motion';
import { Star, Plus } from 'lucide-react';

const products = [
    { id: 1, name: 'Organic Tomato', price: '₹45', unit: 'kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80', rating: 4.8 },
    { id: 2, name: 'Fresh Carrots', price: '₹60', unit: 'kg', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=80', rating: 4.5 },
    { id: 3, name: 'Red Onions', price: '₹30', unit: 'kg', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=500&q=80', rating: 4.7 },
    { id: 4, name: 'Green Spinach', price: '₹20', unit: 'bunch', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=500&q=80', rating: 4.9 },
    { id: 5, name: 'Sweet Corn', price: '₹25', unit: 'pc', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=500&q=80', rating: 4.6 },
    { id: 6, name: 'Bell Peppers', price: '₹80', unit: 'kg', image: 'https://images.unsplash.com/photo-1563565375-f3fdf5dbc240?auto=format&fit=crop&w=500&q=80', rating: 4.7 },
    { id: 7, name: 'Broccoli', price: '₹120', unit: 'kg', image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=500&q=80', rating: 4.8 },
    { id: 8, name: 'Potatoes', price: '₹35', unit: 'kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=80', rating: 4.5 },
];

const categories = [
    { name: 'All', active: true },
    { name: 'Vegetables', active: false },
    { name: 'Fruits', active: false },
    { name: 'Grains', active: false },
];

const ConsumerDashboard = () => {
    return (
        <div>
            {/* Hero Banner */}
            <div className="bg-green-100 rounded-3xl p-8 mb-10 flex items-center justify-between relative overflow-hidden">
                <div className="relative z-10 max-w-lg">
                    <span className="text-green-600 font-bold tracking-wider text-sm uppercase">Fresh from Farm</span>
                    <h1 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">
                        Get <span className="text-green-600">Organic</span> Produce <br /> Delivered to You.
                    </h1>
                    <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition shadow-lg">
                        Shop Now
                    </button>
                </div>
                <div className="hidden md:block w-1/3 relative z-10">
                    <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" alt="Grocery Basket" className="rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition duration-500" />
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-green-200 rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-emerald-200 rounded-full opacity-50 blur-3xl"></div>
            </div>

            {/* Categories */}
            <div className="mb-8 overflow-x-auto pb-2">
                <div className="flex space-x-4">
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${cat.active
                                ? 'bg-gray-900 text-white'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <h2 className="text-xl font-bold text-gray-900 mb-6">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md overflow-hidden transition-all duration-300 group"
                    >
                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                            />
                            <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition">
                                <div className="h-4 w-4 border-2 border-transparent" /> {/* Replacing Heart for simplicity/imports, assume wishlist */}
                                <span className="text-xl leading-none">♡</span>
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                                    <p className="text-xs text-gray-500">Farm: Green Valley</p>
                                </div>
                                <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                    <Star size={12} className="text-yellow-500 fill-current" />
                                    <span className="text-xs font-bold text-yellow-700">{product.rating}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                                <span className="text-lg font-bold text-green-700">{product.price}<span className="text-sm text-gray-500 font-normal">/{product.unit}</span></span>
                                <button className="bg-gray-900 text-white p-2 rounded-xl hover:bg-green-600 transition-colors">
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

        </div>
    );
};

export default ConsumerDashboard;
