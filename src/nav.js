import {
  LayoutDashboard,
  Package,
  LayoutGrid,
  ShoppingCart,
  Users,
  Store,
  Star,
  Image,
  Ticket,
  BarChart3,
  Settings,
} from 'lucide-react'

// Single source of truth for the sidebar + routes.
export const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/categories', label: 'Categories', icon: LayoutGrid },
  { to: '/orders', label: 'Orders', icon: ShoppingCart, badge: '12' },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/vendors', label: 'Vendors', icon: Store },
  { to: '/reviews', label: 'Reviews', icon: Star },
  { to: '/banners', label: 'Banners', icon: Image },
  { to: '/coupons', label: 'Coupons', icon: Ticket },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]
