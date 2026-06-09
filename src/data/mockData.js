// Mock data for the OJAIN admin panel (Jain & Satvik instant premix + pickles).

export const stats = [
  { key: 'revenue', label: 'Total Revenue', value: '₹8,42,560', delta: '+12.5%', up: true },
  { key: 'orders', label: 'Total Orders', value: '3,248', delta: '+8.2%', up: true },
  { key: 'customers', label: 'Customers', value: '25,140', delta: '+5.1%', up: true },
  { key: 'vendors', label: 'Active Vendors', value: '86', delta: '-1.4%', up: false },
]

export const salesData = [
  { month: 'Jan', sales: 42000, orders: 220 },
  { month: 'Feb', sales: 48500, orders: 245 },
  { month: 'Mar', sales: 51200, orders: 268 },
  { month: 'Apr', sales: 47800, orders: 251 },
  { month: 'May', sales: 60500, orders: 312 },
  { month: 'Jun', sales: 72400, orders: 358 },
  { month: 'Jul', sales: 69100, orders: 340 },
  { month: 'Aug', sales: 81200, orders: 402 },
]

export const categorySplit = [
  { name: 'Instant Premix', value: 48 },
  { name: 'Pickles', value: 26 },
  { name: 'Beverages', value: 14 },
  { name: 'Sweets', value: 12 },
]

export const categories = [
  { id: 'CAT-01', name: 'Instant Premix', slug: 'instant-premix', products: 124, status: 'Active' },
  { id: 'CAT-02', name: 'Pickles', slug: 'pickles', products: 58, status: 'Active' },
  { id: 'CAT-03', name: 'Beverages', slug: 'beverages', products: 32, status: 'Active' },
  { id: 'CAT-04', name: 'Sweets', slug: 'sweets', products: 27, status: 'Active' },
  { id: 'CAT-05', name: 'Snacks', slug: 'snacks', products: 41, status: 'Inactive' },
  { id: 'CAT-06', name: 'Spices & Masala', slug: 'spices', products: 19, status: 'Active' },
]

export const products = [
  { id: 'P-1001', name: 'Instant Khichdi Premix', category: 'Instant Premix', price: 149, stock: 320, vendor: 'Satvik Foods', status: 'Active' },
  { id: 'P-1002', name: 'Gujarati Dal Dhokli Mix', category: 'Instant Premix', price: 179, stock: 145, vendor: 'Jain Rasoi', status: 'Active' },
  { id: 'P-1003', name: 'Mango Pickle (Jain)', category: 'Pickles', price: 220, stock: 0, vendor: 'Amba Pickles', status: 'Out of Stock' },
  { id: 'P-1004', name: 'Poha Instant Mix', category: 'Instant Premix', price: 99, stock: 540, vendor: 'Satvik Foods', status: 'Active' },
  { id: 'P-1005', name: 'Lemon Chilli Pickle', category: 'Pickles', price: 199, stock: 88, vendor: 'Amba Pickles', status: 'Active' },
  { id: 'P-1006', name: 'Masala Chaas Premix', category: 'Beverages', price: 120, stock: 210, vendor: 'Gokul Dairy', status: 'Active' },
  { id: 'P-1007', name: 'Sheera / Halwa Mix', category: 'Sweets', price: 159, stock: 36, vendor: 'Jain Rasoi', status: 'Low Stock' },
  { id: 'P-1008', name: 'Upma Instant Mix', category: 'Instant Premix', price: 109, stock: 410, vendor: 'Satvik Foods', status: 'Active' },
  { id: 'P-1009', name: 'Garlic-Free Green Chutney', category: 'Pickles', price: 130, stock: 156, vendor: 'Amba Pickles', status: 'Active' },
  { id: 'P-1010', name: 'Thandai Premix', category: 'Beverages', price: 240, stock: 72, vendor: 'Gokul Dairy', status: 'Active' },
]

export const orders = [
  { id: '#ORD-7841', customer: 'Riya Shah', date: '2026-06-08', items: 3, total: 547, payment: 'UPI', status: 'Delivered' },
  { id: '#ORD-7840', customer: 'Amit Mehta', date: '2026-06-08', items: 1, total: 149, payment: 'COD', status: 'Processing' },
  { id: '#ORD-7839', customer: 'Pooja Jain', date: '2026-06-07', items: 5, total: 1120, payment: 'Card', status: 'Shipped' },
  { id: '#ORD-7838', customer: 'Karan Patel', date: '2026-06-07', items: 2, total: 318, payment: 'UPI', status: 'Pending' },
  { id: '#ORD-7837', customer: 'Sneha Doshi', date: '2026-06-06', items: 4, total: 689, payment: 'UPI', status: 'Delivered' },
  { id: '#ORD-7836', customer: 'Manish Gupta', date: '2026-06-06', items: 1, total: 220, payment: 'COD', status: 'Cancelled' },
  { id: '#ORD-7835', customer: 'Neha Sharma', date: '2026-06-05', items: 6, total: 1545, payment: 'Card', status: 'Delivered' },
  { id: '#ORD-7834', customer: 'Vikram Rao', date: '2026-06-05', items: 2, total: 280, payment: 'UPI', status: 'Processing' },
]

export const customers = [
  { id: 'C-501', name: 'Riya Shah', email: 'riya@example.com', city: 'Ahmedabad', orders: 24, spent: 9840, status: 'Active' },
  { id: 'C-502', name: 'Amit Mehta', email: 'amit@example.com', city: 'Mumbai', orders: 8, spent: 2310, status: 'Active' },
  { id: 'C-503', name: 'Pooja Jain', email: 'pooja@example.com', city: 'Surat', orders: 41, spent: 18750, status: 'VIP' },
  { id: 'C-504', name: 'Karan Patel', email: 'karan@example.com', city: 'Pune', orders: 3, spent: 640, status: 'Active' },
  { id: 'C-505', name: 'Sneha Doshi', email: 'sneha@example.com', city: 'Rajkot', orders: 17, spent: 5420, status: 'Active' },
  { id: 'C-506', name: 'Manish Gupta', email: 'manish@example.com', city: 'Delhi', orders: 1, spent: 220, status: 'Inactive' },
]

export const vendors = [
  { id: 'V-21', name: 'Satvik Foods', owner: 'Meena Shah', products: 38, sales: 142500, rating: 4.8, status: 'Approved' },
  { id: 'V-22', name: 'Jain Rasoi', owner: 'Anita Jain', products: 24, sales: 98200, rating: 4.6, status: 'Approved' },
  { id: 'V-23', name: 'Amba Pickles', owner: 'Rekha Patel', products: 19, sales: 76400, rating: 4.9, status: 'Approved' },
  { id: 'V-24', name: 'Gokul Dairy', owner: 'Suresh Rao', products: 12, sales: 41200, rating: 4.3, status: 'Pending' },
  { id: 'V-25', name: 'Pure Satvik Co.', owner: 'Kavita Desai', products: 0, sales: 0, rating: 0, status: 'Pending' },
]

export const reviews = [
  { id: 'R-91', customer: 'Pooja Jain', product: 'Instant Khichdi Premix', rating: 5, comment: 'Tastes just like home-cooked! Pure Jain, no onion-garlic.', date: '2026-06-08', status: 'Published' },
  { id: 'R-92', customer: 'Amit Mehta', product: 'Mango Pickle (Jain)', rating: 4, comment: 'Good quality, delivery was a bit slow.', date: '2026-06-07', status: 'Published' },
  { id: 'R-93', customer: 'Karan Patel', product: 'Poha Instant Mix', rating: 5, comment: 'Super convenient for office lunch.', date: '2026-06-06', status: 'Pending' },
  { id: 'R-94', customer: 'Neha Sharma', product: 'Thandai Premix', rating: 3, comment: 'A little too sweet for me.', date: '2026-06-05', status: 'Pending' },
  { id: 'R-95', customer: 'Vikram Rao', product: 'Masala Chaas Premix', rating: 5, comment: 'Refreshing and authentic taste.', date: '2026-06-04', status: 'Published' },
]

export const banners = [
  { id: 'B-1', title: 'Monsoon Premix Sale', placement: 'Home Hero', active: true, clicks: 4210 },
  { id: 'B-2', title: 'Buy 2 Get 1 — Pickles', placement: 'Category Top', active: true, clicks: 2180 },
  { id: 'B-3', title: 'New Vendor Onboarding', placement: 'Sidebar', active: false, clicks: 640 },
  { id: 'B-4', title: 'Festive Sweets Combo', placement: 'Home Hero', active: true, clicks: 3320 },
]

export const coupons = [
  { id: 'CPN-1', code: 'JAIN20', type: 'Percent', value: '20%', minOrder: 499, uses: 1240, expiry: '2026-07-31', status: 'Active' },
  { id: 'CPN-2', code: 'FIRST50', type: 'Flat', value: '₹50', minOrder: 299, uses: 3120, expiry: '2026-12-31', status: 'Active' },
  { id: 'CPN-3', code: 'FREESHIP', type: 'Shipping', value: 'Free', minOrder: 699, uses: 880, expiry: '2026-06-30', status: 'Active' },
  { id: 'CPN-4', code: 'MONSOON15', type: 'Percent', value: '15%', minOrder: 399, uses: 410, expiry: '2026-05-31', status: 'Expired' },
]

export const topProducts = [
  { name: 'Instant Khichdi Premix', sold: 1240, revenue: 184760 },
  { name: 'Poha Instant Mix', sold: 980, revenue: 97020 },
  { name: 'Mango Pickle (Jain)', sold: 760, revenue: 167200 },
  { name: 'Upma Instant Mix', sold: 640, revenue: 69760 },
  { name: 'Masala Chaas Premix', sold: 520, revenue: 62400 },
]
