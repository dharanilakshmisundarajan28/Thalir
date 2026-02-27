// src/services/Fertilizer.service.ts

const FERTILIZER_URL = "http://localhost:8080/api/fertilizer";
const FARM_URL       = "http://localhost:8080/api/farm";

// ── Types ─────────────────────────────────────────────────────────────────────

export type OrderStatus     = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type FarmOrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

// Fertilizer (Provider -> Farmer)
export interface ProductResponse {
  id: number; name: string; description: string; brand: string;
  category: string; price: number; stockQuantity: number; unit: string;
  imageUrl: string; isActive: boolean; sellerId: number; sellerName: string; createdAt: string;
}
export interface ProductRequest {
  name: string; description: string; brand: string; category: string;
  price: number; stockQuantity: number; unit: string; imageUrl: string;
}
export interface CartItemResponse {
  cartItemId: number; productId: number; productName: string;
  productImageUrl: string; unit: string; quantity: number;
  priceAtAddition: number; subtotal: number;
}
export interface CartResponse {
  cartId: number; items: CartItemResponse[]; totalPrice: number; totalItems: number;
}
export interface OrderItemResponse {
  productId: number; productName: string; unit: string;
  quantity: number; priceAtOrder: number; subtotal: number;
}
export interface OrderResponse {
  orderId: number; status: OrderStatus; items: OrderItemResponse[];
  totalAmount: number; deliveryAddress: string; deliveryPhone: string;
  notes: string; orderedAt: string;
}
export interface CheckoutRequest {
  deliveryAddress: string; deliveryPhone: string; notes: string;
}

// Farm produce (Farmer -> Consumer)
export interface FarmProductResponse {
  id: number; name: string; description: string; category: string;
  price: number; stockQuantity: number; unit: string; imageUrl: string;
  isActive: boolean; farmerId: number; farmerName: string; createdAt: string;
}
export interface FarmProductRequest {
  name: string; description: string; category: string;
  price: number; stockQuantity: number; unit: string; imageUrl: string;
}
export interface FarmCartItemResponse {
  cartItemId: number; productId: number; productName: string;
  farmerName: string; unit: string; quantity: number;
  priceAtAddition: number; subtotal: number;
}
export interface FarmCartResponse {
  cartId: number; items: FarmCartItemResponse[]; totalPrice: number; totalItems: number;
}
export interface FarmOrderItemResponse {
  productId: number; productName: string; unit: string;
  quantity: number; priceAtOrder: number; subtotal: number;
}
export interface FarmOrderResponse {
  orderId: number; status: FarmOrderStatus; items: FarmOrderItemResponse[];
  totalAmount: number; consumerName: string; farmerName: string;
  deliveryAddress: string; deliveryPhone: string; notes: string; orderedAt: string;
}
export interface FarmCheckoutRequest {
  deliveryAddress: string; deliveryPhone: string; notes: string;
}

// Shared
export interface Page<T> {
  content: T[]; totalElements: number; totalPages: number; number: number; size: number;
}

// ── Auth helpers ──────────────────────────────────────────────────────────────

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user?.roles?.includes(role) ?? false;
};

// ── Request helpers ───────────────────────────────────────────────────────────

const getAuthHeaders = (): HeadersInit => {
  const user = getCurrentUser();
  const token = user?.token ?? user?.accessToken ?? null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "Request failed");
  }
  return res.status === 204 ? (undefined as T) : res.json();
};

// ════════════════════════════════════════════════════════════════════════════
// FERTILIZER APIs  (Provider -> Farmer)
// ════════════════════════════════════════════════════════════════════════════

export const productService = {
  getAll: (page = 0, size = 10, sortBy = "name"): Promise<Page<ProductResponse>> =>
    fetch(`${FERTILIZER_URL}/products?page=${page}&size=${size}&sortBy=${sortBy}`, {
      headers: getAuthHeaders() }).then(r => handleResponse(r)),

  search: (keyword: string, page = 0, size = 10): Promise<Page<ProductResponse>> =>
    fetch(`${FERTILIZER_URL}/products/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`, {
      headers: getAuthHeaders() }).then(r => handleResponse(r)),

  getByCategory: (category: string, page = 0, size = 10): Promise<Page<ProductResponse>> =>
    fetch(`${FERTILIZER_URL}/products/category/${encodeURIComponent(category)}?page=${page}&size=${size}`, {
      headers: getAuthHeaders() }).then(r => handleResponse(r)),

  getById: (id: number): Promise<ProductResponse> =>
    fetch(`${FERTILIZER_URL}/products/${id}`, { headers: getAuthHeaders() }).then(r => handleResponse(r)),

  create: (data: ProductRequest): Promise<ProductResponse> =>
    fetch(`${FERTILIZER_URL}/products`, {
      method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) }).then(r => handleResponse(r)),

  update: (id: number, data: ProductRequest): Promise<ProductResponse> =>
    fetch(`${FERTILIZER_URL}/products/${id}`, {
      method: "PUT", headers: getAuthHeaders(), body: JSON.stringify(data) }).then(r => handleResponse(r)),

  deactivate: (id: number): Promise<void> =>
    fetch(`${FERTILIZER_URL}/products/${id}/deactivate`, {
      method: "PATCH", headers: getAuthHeaders() }).then(r => handleResponse(r)),

  delete: (id: number): Promise<void> =>
    fetch(`${FERTILIZER_URL}/products/${id}`, {
      method: "DELETE", headers: getAuthHeaders() }).then(r => handleResponse(r)),

  getMyProducts: (): Promise<ProductResponse[]> =>
    fetch(`${FERTILIZER_URL}/products/my`, { headers: getAuthHeaders() }).then(r => handleResponse(r)),
};

export const cartService = {
  getCart: (): Promise<CartResponse> =>
    fetch(`${FERTILIZER_URL}/cart`, { headers: getAuthHeaders() }).then(r => handleResponse(r)),

  addItem: (productId: number, quantity: number): Promise<CartResponse> =>
    fetch(`${FERTILIZER_URL}/cart/items`, {
      method: "POST", headers: getAuthHeaders(), body: JSON.stringify({ productId, quantity }) }).then(r => handleResponse(r)),

  updateItem: (cartItemId: number, quantity: number): Promise<CartResponse> =>
    fetch(`${FERTILIZER_URL}/cart/items/${cartItemId}?quantity=${quantity}`, {
      method: "PUT", headers: getAuthHeaders() }).then(r => handleResponse(r)),

  removeItem: (cartItemId: number): Promise<CartResponse> =>
    fetch(`${FERTILIZER_URL}/cart/items/${cartItemId}`, {
      method: "DELETE", headers: getAuthHeaders() }).then(r => handleResponse(r)),

  clearCart: (): Promise<void> =>
    fetch(`${FERTILIZER_URL}/cart`, {
      method: "DELETE", headers: getAuthHeaders() }).then(r => handleResponse(r)),
};

export const orderService = {
  // FARMER: buy fertilizer from provider
  checkout: (data: CheckoutRequest): Promise<OrderResponse> =>
    fetch(`${FERTILIZER_URL}/orders/checkout`, {
      method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) }).then(r => handleResponse(r)),

  // FARMER: own fertilizer orders  (/orders/my)
  getMyOrders: (page = 0, size = 10): Promise<Page<OrderResponse>> =>
    fetch(`${FERTILIZER_URL}/orders/my?page=${page}&size=${size}`, {
      headers: getAuthHeaders() }).then(r => handleResponse(r)),

  getMyOrder: (orderId: number): Promise<OrderResponse> =>
    fetch(`${FERTILIZER_URL}/orders/my/${orderId}`, {
      headers: getAuthHeaders() }).then(r => handleResponse(r)),

  cancelOrder: (orderId: number): Promise<OrderResponse> =>
    fetch(`${FERTILIZER_URL}/orders/my/${orderId}/cancel`, {
      method: "PATCH", headers: getAuthHeaders() }).then(r => handleResponse(r)),

  // PROVIDER / ADMIN: all fertilizer orders  (/orders)
  getAllOrders: (page = 0, size = 20): Promise<Page<OrderResponse>> =>
    fetch(`${FERTILIZER_URL}/orders?page=${page}&size=${size}`, {
      headers: getAuthHeaders() }).then(r => handleResponse(r)),

  updateStatus: (orderId: number, status: OrderStatus): Promise<OrderResponse> =>
    fetch(`${FERTILIZER_URL}/orders/${orderId}/status`, {
      method: "PATCH", headers: getAuthHeaders(), body: JSON.stringify({ status }) }).then(r => handleResponse(r)),

  // Role-aware helper — use this in OrderHistory component
  fetchOrders: (page = 0, size = 10): Promise<Page<OrderResponse>> => {
    if (hasRole("ROLE_FARMER")) {
      return orderService.getMyOrders(page, size);       // /orders/my  → FARMER
    }
    return orderService.getAllOrders(page, size);         // /orders     → PROVIDER/ADMIN
  },
};

// ════════════════════════════════════════════════════════════════════════════
// FARM PRODUCE APIs  (Farmer -> Consumer)
// ════════════════════════════════════════════════════════════════════════════

export const farmProductService = {
  // Public / Consumer: browse
  getAll: (page = 0, size = 10, sortBy = "name"): Promise<Page<FarmProductResponse>> =>
    fetch(`${FARM_URL}/products?page=${page}&size=${size}&sortBy=${sortBy}`, {
      headers: getAuthHeaders() }).then(r => handleResponse(r)),

  search: (keyword: string, page = 0, size = 10): Promise<Page<FarmProductResponse>> =>
    fetch(`${FARM_URL}/products/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`, {
      headers: getAuthHeaders() }).then(r => handleResponse(r)),

  getByCategory: (category: string, page = 0, size = 10): Promise<Page<FarmProductResponse>> =>
    fetch(`${FARM_URL}/products/category/${encodeURIComponent(category)}?page=${page}&size=${size}`, {
      headers: getAuthHeaders() }).then(r => handleResponse(r)),

  getByFarmer: (farmerId: number, page = 0, size = 10): Promise<Page<FarmProductResponse>> =>
    fetch(`${FARM_URL}/products/farmer/${farmerId}?page=${page}&size=${size}`, {
      headers: getAuthHeaders() }).then(r => handleResponse(r)),

  getById: (id: number): Promise<FarmProductResponse> =>
    fetch(`${FARM_URL}/products/${id}`, { headers: getAuthHeaders() }).then(r => handleResponse(r)),

  // Farmer: manage own produce
  getMyProducts: (): Promise<FarmProductResponse[]> =>
    fetch(`${FARM_URL}/products/my`, { headers: getAuthHeaders() }).then(r => handleResponse(r)),

  create: (data: FarmProductRequest): Promise<FarmProductResponse> =>
    fetch(`${FARM_URL}/products`, {
      method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) }).then(r => handleResponse(r)),

  update: (id: number, data: FarmProductRequest): Promise<FarmProductResponse> =>
    fetch(`${FARM_URL}/products/${id}`, {
      method: "PUT", headers: getAuthHeaders(), body: JSON.stringify(data) }).then(r => handleResponse(r)),

  deactivate: (id: number): Promise<void> =>
    fetch(`${FARM_URL}/products/${id}/deactivate`, {
      method: "PATCH", headers: getAuthHeaders() }).then(r => handleResponse(r)),

  delete: (id: number): Promise<void> =>
    fetch(`${FARM_URL}/products/${id}`, {
      method: "DELETE", headers: getAuthHeaders() }).then(r => handleResponse(r)),
};

export const farmCartService = {
  getCart: (): Promise<FarmCartResponse> =>
    fetch(`${FARM_URL}/cart`, { headers: getAuthHeaders() }).then(r => handleResponse(r)),

  addItem: (productId: number, quantity: number): Promise<FarmCartResponse> =>
    fetch(`${FARM_URL}/cart/items`, {
      method: "POST", headers: getAuthHeaders(), body: JSON.stringify({ productId, quantity }) }).then(r => handleResponse(r)),

  updateItem: (cartItemId: number, quantity: number): Promise<FarmCartResponse> =>
    fetch(`${FARM_URL}/cart/items/${cartItemId}?quantity=${quantity}`, {
      method: "PUT", headers: getAuthHeaders() }).then(r => handleResponse(r)),

  removeItem: (cartItemId: number): Promise<FarmCartResponse> =>
    fetch(`${FARM_URL}/cart/items/${cartItemId}`, {
      method: "DELETE", headers: getAuthHeaders() }).then(r => handleResponse(r)),

  clearCart: (): Promise<void> =>
    fetch(`${FARM_URL}/cart`, { method: "DELETE", headers: getAuthHeaders() }).then(r => handleResponse(r)),
};

export const farmOrderService = {
  // Consumer: buy farm produce
  checkout: (data: FarmCheckoutRequest): Promise<FarmOrderResponse> =>
    fetch(`${FARM_URL}/orders/checkout`, {
      method: "POST", headers: getAuthHeaders(), body: JSON.stringify(data) }).then(r => handleResponse(r)),

  // Consumer: own orders
  getMyOrders: (page = 0, size = 10): Promise<Page<FarmOrderResponse>> =>
    fetch(`${FARM_URL}/orders/my?page=${page}&size=${size}`, {
      headers: getAuthHeaders() }).then(r => handleResponse(r)),

  getMyOrder: (orderId: number): Promise<FarmOrderResponse> =>
    fetch(`${FARM_URL}/orders/my/${orderId}`, { headers: getAuthHeaders() }).then(r => handleResponse(r)),

  cancelOrder: (orderId: number): Promise<FarmOrderResponse> =>
    fetch(`${FARM_URL}/orders/my/${orderId}/cancel`, {
      method: "PATCH", headers: getAuthHeaders() }).then(r => handleResponse(r)),

  // Farmer: orders received for their produce
  getReceivedOrders: (page = 0, size = 10): Promise<Page<FarmOrderResponse>> =>
    fetch(`${FARM_URL}/orders/received?page=${page}&size=${size}`, {
      headers: getAuthHeaders() }).then(r => handleResponse(r)),

  updateStatus: (orderId: number, status: FarmOrderStatus): Promise<FarmOrderResponse> =>
    fetch(`${FARM_URL}/orders/${orderId}/status`, {
      method: "PATCH", headers: getAuthHeaders(), body: JSON.stringify({ status }) }).then(r => handleResponse(r)),
};