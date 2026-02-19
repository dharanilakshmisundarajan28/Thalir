// import { motion } from 'framer-motion';
// import { Star, Plus } from 'lucide-react';

// const products = [
//     { id: 1, name: 'Organic Tomato', price: '₹45', unit: 'kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80', rating: 4.8 },
//     { id: 2, name: 'Fresh Carrots', price: '₹60', unit: 'kg', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=80', rating: 4.5 },
//     { id: 3, name: 'Red Onions', price: '₹30', unit: 'kg', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=500&q=80', rating: 4.7 },
//     { id: 4, name: 'Green Spinach', price: '₹20', unit: 'bunch', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=500&q=80', rating: 4.9 },
//     { id: 5, name: 'Sweet Corn', price: '₹25', unit: 'pc', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=500&q=80', rating: 4.6 },
//     { id: 6, name: 'Bell Peppers', price: '₹80', unit: 'kg', image: 'https://images.unsplash.com/photo-1563565375-f3fdf5dbc240?auto=format&fit=crop&w=500&q=80', rating: 4.7 },
//     { id: 7, name: 'Broccoli', price: '₹120', unit: 'kg', image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=500&q=80', rating: 4.8 },
//     { id: 8, name: 'Potatoes', price: '₹35', unit: 'kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=80', rating: 4.5 },
// ];

// const categories = [
//     { name: 'All', active: true },
//     { name: 'Vegetables', active: false },
//     { name: 'Fruits', active: false },
//     { name: 'Grains', active: false },
// ];

// const ConsumerDashboard = () => {
//     return (
//         <div>
//             {/* Hero Banner */}
//             <div className="bg-green-100 rounded-3xl p-8 mb-10 flex items-center justify-between relative overflow-hidden">
//                 <div className="relative z-10 max-w-lg">
//                     <span className="text-green-600 font-bold tracking-wider text-sm uppercase">Fresh from Farm</span>
//                     <h1 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4 leading-tight">
//                         Get <span className="text-green-600">Organic</span> Produce <br /> Delivered to You.
//                     </h1>
//                     <button className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition shadow-lg">
//                         Shop Now
//                     </button>
//                 </div>
//                 <div className="hidden md:block w-1/3 relative z-10">
//                     <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" alt="Grocery Basket" className="rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition duration-500" />
//                 </div>

//                 {/* Decorative Circles */}
//                 <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-green-200 rounded-full opacity-50 blur-3xl"></div>
//                 <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-emerald-200 rounded-full opacity-50 blur-3xl"></div>
//             </div>

//             {/* Categories */}
//             <div className="mb-8 overflow-x-auto pb-2">
//                 <div className="flex space-x-4">
//                     {categories.map((cat, idx) => (
//                         <button
//                             key={idx}
//                             className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${cat.active
//                                 ? 'bg-gray-900 text-white'
//                                 : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
//                                 }`}
//                         >
//                             {cat.name}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Product Grid */}
//             <h2 className="text-xl font-bold text-gray-900 mb-6">Featured Products</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {products.map((product) => (
//                     <motion.div
//                         key={product.id}
//                         whileHover={{ y: -5 }}
//                         className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md overflow-hidden transition-all duration-300 group"
//                     >
//                         <div className="relative h-48 bg-gray-100 overflow-hidden">
//                             <img
//                                 src={product.image}
//                                 alt={product.name}
//                                 className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
//                             />
//                             <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition">
//                                 <div className="h-4 w-4 border-2 border-transparent" /> {/* Replacing Heart for simplicity/imports, assume wishlist */}
//                                 <span className="text-xl leading-none">♡</span>
//                             </button>
//                         </div>
//                         <div className="p-4">
//                             <div className="flex justify-between items-start mb-2">
//                                 <div>
//                                     <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
//                                     <p className="text-xs text-gray-500">Farm: Green Valley</p>
//                                 </div>
//                                 <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
//                                     <Star size={12} className="text-yellow-500 fill-current" />
//                                     <span className="text-xs font-bold text-yellow-700">{product.rating}</span>
//                                 </div>
//                             </div>

//                             <div className="flex justify-between items-center mt-4">
//                                 <span className="text-lg font-bold text-green-700">{product.price}<span className="text-sm text-gray-500 font-normal">/{product.unit}</span></span>
//                                 <button className="bg-gray-900 text-white p-2 rounded-xl hover:bg-green-600 transition-colors">
//                                     <Plus size={20} />
//                                 </button>
//                             </div>
//                         </div>
//                     </motion.div>
//                 ))}
//             </div>

//         </div>
//     );
// };

// export default ConsumerDashboard;
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, Heart, ShoppingCart, X, Minus } from "lucide-react";
import { useOutletContext } from "react-router-dom";

/* ================= IMAGE HELPER ================= */
const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

/* ================= PRODUCTS (30 ITEMS) ================= */
const products = [
  // Vegetables
  { id: 1, name: "Organic Tomato", price: 45, category: "Vegetables", unit: "kg", image: img("photo-1592924357228-91a4daadcfea"), rating: 4.8 },
  { id: 2, name: "Fresh Carrots", price: 60, category: "Vegetables", unit: "kg", image: img("photo-1447175008436-054170c2e979"), rating: 4.5 },
  { id: 3, name: "Red Onion", price: 35, category: "Vegetables", unit: "kg", image: img("photo-1618512496248-a07fe83aa8cb"), rating: 4.6 },
  { id: 4, name: "Green Spinach", price: 25, category: "Vegetables", unit: "bunch", image: img("photo-1576045057995-568f588f82fb"), rating: 4.7 },
  { id: 5, name: "Capsicum", price: 80, category: "Vegetables", unit: "kg", image: img("photo-1563565375-f3fdf5dbc240"), rating: 4.5 },

  // Fruits
  { id: 6, name: "Red Apples", price: 120, category: "Fruits", unit: "kg", image: img("photo-1560806887-1e4cd0b6cbd6"), rating: 4.7 },
  { id: 7, name: "Banana", price: 50, category: "Fruits", unit: "dozen", image: img("photo-1574226516831-e1dff420e8f8"), rating: 4.6 },
  { id: 8, name: "Orange", price: 90, category: "Fruits", unit: "kg", image: img("photo-1580052614034-c55d20bfee3b"), rating: 4.5 },
  { id: 9, name: "Strawberry", price: 150, category: "Fruits", unit: "box", image: img("photo-1464965911861-746a04b4bca6"), rating: 4.8 },
  { id: 10, name: "Pomegranate", price: 140, category: "Fruits", unit: "kg", image: img("photo-1553279768-865429fa0078"), rating: 4.6 },

  // Grains & Pulses
  { id: 11, name: "Basmati Rice", price: 90, category: "Grains", unit: "kg", image: img("photo-1586201375761-83865001e31c"), rating: 4.8 },
  { id: 12, name: "Wheat", price: 55, category: "Grains", unit: "kg", image: img("photo-1603048297172-c92544798d5a"), rating: 4.5 },
  { id: 13, name: "Toor Dal", price: 110, category: "Grains", unit: "kg", image: img("photo-1612257999756-4c4c3f276f4e"), rating: 4.6 },
  { id: 14, name: "Sweet Corn", price: 25, category: "Grains", unit: "pc", image: img("photo-1551754655-cd27e38d2076"), rating: 4.6 },
  { id: 15, name: "Green Gram", price: 130, category: "Grains", unit: "kg", image: img("photo-1515548214078-57c7c2a28c0c"), rating: 4.7 },
];

/* ================= CATEGORIES ================= */
const categories = [
  { name: "All", image: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png" },
  { name: "Vegetables", image: "https://cdn-icons-png.flaticon.com/512/766/766020.png" },
  { name: "Fruits", image: "https://cdn-icons-png.flaticon.com/512/415/415682.png" },
  { name: "Grains", image: "https://cdn-icons-png.flaticon.com/512/2909/2909766.png" },
];

/* ================= COMPONENT ================= */
export default function ConsumerDashboard() {
  const { search, setCartCount, openCart, setOpenCart } =
    useOutletContext<any>();

  const [activeCat, setActiveCat] = useState("All");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  /* ================= FILTER ================= */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCat === "All" || p.category === activeCat;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCat, search]);

  /* ================= CART ================= */
  const addToCart = (product: any) => {
    setCart((prev: any[]) => {
      const exists = prev.find((i) => i.id === product.id);
      let updated;

      if (exists) {
        updated = prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        updated = [...prev, { ...product, qty: 1 }];
      }

      setCartCount(updated.reduce((s, i) => s + i.qty, 0));
      return updated;
    });
  };

  const changeQty = (id: number, delta: number) => {
    setCart((prev: any[]) => {
      const updated = prev
        .map((i) =>
          i.id === id ? { ...i, qty: i.qty + delta } : i
        )
        .filter((i) => i.qty > 0);

      setCartCount(updated.reduce((s, i) => s + i.qty, 0));
      return updated;
    });
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-8">
      {/* CATEGORY ICONS CENTERED */}
      <div className="flex justify-center gap-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCat(cat.name)}
            className="flex flex-col items-center gap-2"
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                activeCat === cat.name
                  ? "border-green-600 bg-green-50 scale-110 shadow-md"
                  : "border-gray-200 bg-white hover:scale-105"
              }`}
            >
              <img src={cat.image} className="w-7 h-7" />
            </div>
            <span className="text-sm font-medium">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredProducts.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ y: -8 }}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all"
          >
            <div className="relative overflow-hidden">
              <img
                src={p.image}
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://via.placeholder.com/400x300?text=Farm+Product")
                }
                className="w-full h-44 object-cover group-hover:scale-110 transition duration-500"
              />

              <button
                onClick={() => toggleWishlist(p.id)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow"
              >
                <Heart
                  size={16}
                  className={
                    wishlist.includes(p.id)
                      ? "text-red-500"
                      : "text-gray-400"
                  }
                />
              </button>
            </div>

            <div className="p-4 space-y-2">
              <div className="font-semibold">{p.name}</div>

              <div className="flex items-center text-sm text-gray-500 gap-1">
                <Star size={14} className="text-yellow-400" />
                {p.rating}
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="font-bold text-green-600">
                  ₹{p.price}/{p.unit}
                </div>

                <button
                  onClick={() => addToCart(p)}
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg active:scale-95 transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CART DRAWER */}
      <AnimatePresence>
        {openCart && (
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            className="fixed right-0 top-0 w-80 h-full bg-white shadow-2xl p-5 z-50 overflow-y-auto"
          >
            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-lg">Cart Summary</h2>
              <X className="cursor-pointer" onClick={() => setOpenCart(false)} />
            </div>

            {cart.map((i) => (
              <div key={i.id} className="mb-4">
                <div className="font-medium">{i.name}</div>
                <div className="flex justify-between items-center mt-1">
                  <div className="flex items-center gap-2">
                    <button onClick={() => changeQty(i.id, -1)}>
                      <Minus size={14} />
                    </button>
                    {i.qty}
                    <button onClick={() => changeQty(i.id, 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <b>₹{i.price * i.qty}</b>
                </div>
              </div>
            ))}

            <hr className="my-4" />
            <div className="font-bold text-lg">Total: ₹{total}</div>

            <button className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">
              Place Order
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}