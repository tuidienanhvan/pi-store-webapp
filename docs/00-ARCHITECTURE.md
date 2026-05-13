# 00 - Architecture & Stack (Store)

Kiến trúc kỹ thuật của PI Storefront Webapp.

## Tech Stack
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Lightweight client state)
- **Routing**: [React Router v7](https://reactrouter.com/) (Data APIs ready)
- **Build Tool**: Vite with optimized chunks for fast initial load.

## Project Structure
```
src/
├── api/                  # API clients (axios/fetch)
├── components/           # UI Components
│   ├── home/               # Homepage sections (Hero, Bento, CTA)
│   ├── product/            # Product cards, Pricing tables
│   ├── layout/             # Store Shell (Header, Footer)
│   └── ui/                 # Atomic UI components
├── pages/                # Route pages (Home, Product, Cart, Checkout)
├── stores/               # Zustand stores (cart, user)
├── data/                 # Static catalog data
└── lib/                  # Utilities (i18n, formatting)
```

## Core Logic
1. **Catalog Sync**: Dữ liệu sản phẩm được đồng bộ từ Backend thông qua `scripts/sync-catalog.mjs`.
2. **Cart Logic**: Quản lý giỏ hàng phía Client qua Zustand, lưu trữ persistent vào `localStorage`.
3. **Checkout**: Tích hợp luồng thanh toán an toàn, xử lý mã giảm giá và kích hoạt license ngay lập tức.
