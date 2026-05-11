import "./HomeStore.css";
import React, { useState } from "react";
import { Button, Badge, Icon } from "../ui";

const CATEGORIES = [
  { id: 'all', label: 'Tất cả', icon: 'grid' },
  { id: 'ai', label: 'AI Plugins', icon: 'zap' },
  { id: 'themes', label: 'Premium Themes', icon: 'palette' },
  { id: 'perf', label: 'Performance', icon: 'gauge' },
  { id: 'security', label: 'Security', icon: 'shield' },
];

const MOCK_PRODUCTS = [
  {
    id: 1,
    category: 'ai',
    name: 'Pi AI Chatbot Pro',
    desc: 'Tích hợp GPT-4o trực tiếp vào WordPress với dữ liệu riêng (RAG).',
    price: '$49',
    rating: 4.9,
    sales: '1.2k',
    image: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?q=80&w=300&h=200&auto=format&fit=crop'
  },
  {
    id: 2,
    category: 'themes',
    name: 'Saigon House Elite',
    desc: 'Theme bất động sản cao cấp, tối ưu SEO và tốc độ tải trang cực đỉnh.',
    price: '$79',
    rating: 5.0,
    sales: '850',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=300&h=200&auto=format&fit=crop'
  },
  {
    id: 3,
    category: 'perf',
    name: 'Pi Speed Optimizer',
    desc: 'Tự động tối ưu ảnh, nén JS/CSS và cấu hình CDN chỉ với 1 click.',
    price: '$29',
    rating: 4.8,
    sales: '2.5k',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&h=200&auto=format&fit=crop'
  },
  {
    id: 4,
    category: 'ai',
    name: 'Pi SEO Writer',
    desc: 'Viết bài chuẩn SEO tự động theo từ khóa dựa trên dữ liệu Google Search.',
    price: '$39',
    rating: 4.7,
    sales: '3k',
    image: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=300&h=200&auto=format&fit=crop'
  }
];

export function HomeStore() {
  const [activeCat, setActiveCat] = useState('all');

  const filteredProducts = activeCat === 'all' 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.category === activeCat);

  return (
    <section className="home-store">
      <div className="mx-auto w-full max-w-[1400px] px-8 lg:px-20">
        <div className="home-store__header">
          <div className="home-store__title-group">
            <Badge tone="brand" className="store-badge">Marketplace</Badge>
            <h2 className="home-store__headline">Khám phá Pi Store</h2>
            <p className="home-store__subline">Hàng trăm công cụ mạnh mẽ để nâng tầm website của bạn</p>
          </div>
          
          <div className="home-store__categories">
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`category-chip ${activeCat === cat.id ? 'active' : ''}`}
              >
                <Icon name={cat.icon} size={16} />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="home-store__grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card glass-shell">
              <div className="product-card__image">
                <img src={product.image} alt={product.name} />
                <div className="product-card__overlay">
                  <Button size="sm" variant="primary">Xem chi tiết</Button>
                </div>
                <Badge tone="brand" className="product-category-tag">
                  {CATEGORIES.find(c => c.id === product.category)?.label}
                </Badge>
              </div>
              
              <div className="product-card__content">
                <div className="product-card__meta">
                  <span className="rating"><Icon name="star" size={12} /> {product.rating}</span>
                  <span className="sales">{product.sales} đã mua</span>
                </div>
                <h3 className="product-card__name">{product.name}</h3>
                <p className="product-card__desc">{product.desc}</p>
                
                <div className="product-card__footer">
                  <span className="product-card__price">{product.price}</span>
                  <Button size="sm" variant="ghost" icon="shopping-cart" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="home-store__footer">
          <Button variant="outline" size="lg" className="view-all-btn">
            Xem tất cả sản phẩm <Icon name="arrow-right" size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}
