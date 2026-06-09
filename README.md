# OJAIN — Admin Panel Dashboard

A responsive admin panel for **OJAIN**, a pure Jain & Satvik instant-premix food-delivery platform
(inspired by https://ojainwebsite.netlify.app/). Built with **React + Vite + Tailwind CSS**.

## ✨ Features

- Collapsible **sidebar** + sticky topbar, fully responsive (mobile drawer)
- **Dashboard** with KPI cards and Recharts (area, pie, bar) visualisations
- Full CRUD-style pages for every sidebar item:

| Page | What it manages |
|------|-----------------|
| Dashboard | Revenue, orders, customers, vendors overview + charts |
| Products | Premix & pickle catalogue, stock, price, vendor |
| Categories | Product categories (Instant Premix, Pickles, …) |
| Orders | Orders with status filters (Pending → Delivered) |
| Customers | Customer list, spend, status |
| Vendors | Vendor approvals, ratings, sales |
| Reviews | Review moderation (approve / delete) |
| Banners | Promotional banners with active toggles |
| Coupons | Discount codes |
| Reports | Sales analytics + export |
| Settings | Store / profile / notifications / payments |

- Search & filtering, status badges, reusable `DataTable` component
- Green "leaf" brand theme matching the OJAIN storefront

## 🚀 Getting started

```bash
cd ojain-admin
npm install
npm run dev
```

Then open http://localhost:5173

## 🏗️ Build

```bash
npm run build
npm run preview
```

## 🧱 Tech stack

- React 18 + React Router 6
- Vite 5
- Tailwind CSS 3
- Recharts (charts)
- lucide-react (icons)

## 📁 Structure

```
src/
├── components/    # Layout, Sidebar, Topbar, shared UI (DataTable, badges…)
├── data/          # mockData.js (replace with your API)
├── pages/         # one file per sidebar route
├── nav.js         # sidebar/route config (single source of truth)
└── App.jsx        # routes
```

> All data lives in `src/data/mockData.js`. Swap it for real API calls to connect a backend.
