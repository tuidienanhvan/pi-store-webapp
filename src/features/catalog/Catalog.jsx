import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLocale } from "@/_shared/context/LocaleContext";
import { Input, Button, Card, Badge } from "@/_shared/components/ui";
import { 
  Search, Layers, Zap, X, Package, Check, 
  Loader2, ArrowRight, MousePointer2, Info,
  Filter, Grid3x3, ArrowUpRight, Cpu, Activity
} from "lucide-react";
import './Catalog.css';

const CatalogEmptyState = ({ onReset }) => (
  <div className="catalog-empty-quantum">
    <div className="empty-visual">
      <Package size={48} className="empty-icon" />
    </div>
    
    <div className="empty-content">
      <h3 className="empty-title">
        <span className="text-gradient">KHÔNG TÌM THẤY SẢN PHẨM</span>
      </h3>
      <p className="empty-desc">
        Hệ thống không tìm thấy sản phẩm nào khớp với bộ lọc hiện tại. 
        Vui lòng thử từ khóa khác hoặc làm mới bộ lọc.
      </p>
      
      <div className="empty-actions">
        <Button variant="ghost" className="reset-btn" onClick={onReset}>
          <Activity size={16} className="mr-2" />
          <span>LÀM MỚI BỘ LỌC</span>
        </Button>
      </div>
    </div>

    <div className="empty-meta-hud">
      <div className="meta-unit">
        <Cpu size={12} />
        <span>HỆ THỐNG: SẴN SÀNG</span>
      </div>
      <div className="divider" />
      <span>SẢN PHẨM KHÔNG TỒN TẠI</span>
    </div>
  </div>
);

export function Catalog({ products = [] }) {
  const { dict } = useLocale();
  const t = dict.catalog;
  
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [leadProduct, setLeadProduct] = useState(null);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const haystack = `${p.name} ${p.tagline} ${p.type}`.toLowerCase();
      const matchSearch = haystack.includes(search.toLowerCase());
      const matchCat = category === "all" || p.type === category;
      return matchSearch && matchCat;
    });
  }, [products, search, category]);

  const categories = [
    { id: "all", label: t.categories.all },
    { id: "platform", label: t.categories.platform },
    { id: "addon", label: t.categories.addon },
    { id: "theme", label: t.categories.theme },
  ];

  const handleReset = () => {
    setSearch("");
    setCategory("all");
  };

  return (
    <div className="catalog-page">
      <div className="quantum-mesh-bg" />
      
      <header className="catalog-hero-premium">
        <div className="hero-hud-decorators">
          <div className="hud-line top" />
          <div className="hud-corner tl" />
          <div className="hud-corner tr" />
        </div>

        <div className="mx-auto w-full max-w-[1400px] px-6 relative z-10">
          <div className="catalog-hero-inner">
            <div className="hero-badge-quantum stagger-1">
              <Activity size={12} className="text-primary pulse" />
              <span>CỬA HÀNG PI V2.0</span>
            </div>

            <h1 className="catalog-title-quantum stagger-2">
              <span className="text-gradient">Hệ Sinh Thái</span><br />
              <span>WordPress AI</span>
            </h1>
            
            <p className="catalog-subtitle-quantum stagger-3">
              {t.shelfHint}
            </p>
            
            <div className="catalog-search-quantum stagger-4">
              <div className="search-box-wrapper-quantum glass-panel">
                <Search className="search-icon" size={20} />
                <input 
                  type="text" 
                  placeholder={t.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input-quantum"
                />
                <div className="search-shimmer" />
              </div>
              
              <div className="filter-pills-quantum">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`filter-pill ${category === cat.id ?"active" : ""}`}
                    onClick={() => setCategory(cat.id)}
                  >
                    <div className="pill-bg" />
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-6 py-24 relative z-10">
        <div className="catalog-meta-hud">
          <div className="meta-left">
            <div className="results-badge">
              <div className="dot" />
              <span>{filtered.length} SẢN PHẨM TÌM THẤY</span>
            </div>
          </div>
          <div className="meta-right">
             <div className="sort-box-quantum">
               <Filter size={14} className="text-primary" />
               <span className="label">SẮP XẾP:</span>
               <span className="value">MỚI NHẤT</span>
             </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="catalog-grid-quantum">
            {filtered.map((p, idx) => (
              <Card key={p.id} className={`catalog-item-card-quantum glass-panel stagger-${(idx % 4) + 1}`}>
                <div className="card-hud-index">0{idx + 1}</div>
                
                <div className="card-header">
                  <div className="icon-unit">
                    <div className="icon-wrap">
                      {p.type === "platform" ? <Layers size={22} /> : <Zap size={22} />}
                    </div>
                  </div>
                  <Badge className="type-badge" tone={p.type === "platform" ? "brand" : "info"}>
                    {p.type.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="card-body">
                  <h3 className="item-name">{p.name}</h3>
                  <p className="item-tagline">{p.tagline}</p>
                </div>

                <div className="card-footer-quantum">
                  <div className="price-unit-quantum">
                    {p.priceUsd != null ? (
                      <>
                        <span className="currency">$</span>
                        <span className="amount">{p.priceUsd}</span>
                        <span className="period">/LIFETIME</span>
                      </>
                    ) : (
                      <span className="amount-text">{p.tiers ? "SUBSCRIPTION" : "CONTACT"}</span>
                    )}
                  </div>
                  
                  <div className="card-actions">
                    <Button 
                      as={Link} 
                      to={p.id === "pi-ecosystem" ? "/product/pi-ecosystem" : "/pricing"} 
                      variant="ghost" 
                      className="btn-details"
                    >
                      <Info size={14} className="mr-2" />
                      <span>INFO</span>
                    </Button>
                    <Button 
                      variant="primary" 
                      className="btn-buy" 
                      onClick={() => setLeadProduct(p)}
                    >
                      <span>MUA NGAY</span>
                      <ArrowUpRight size={14} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <CatalogEmptyState onReset={handleReset} t={t} />
        )}
      </main>

      {leadProduct && (
        <LeadModal 
          product={leadProduct} 
          onClose={() => setLeadProduct(null)} 
          t={t.leadForm}
        />
      )}
    </div>
  );
}

function LeadModal({ product, onClose, t }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await new Promise(r => setTimeout(r, 1000));
      setStatus("success");
      setTimeout(onClose, 2000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="lead-modal-overlay" onClick={onClose}>
      <div className="lead-modal-quantum" onClick={e => e.stopPropagation()}>
        <div className="modal-hud-decorators">
          <div className="hud-corner tl" />
          <div className="hud-corner tr" />
        </div>
        
        <button className="modal-close-quantum" onClick={onClose}><X size={20} /></button>

        <div className="modal-content-stack">
          <header className="modal-header-quantum">
            <Badge tone="brand" className="mb-4">YÊU CẦU TƯ VẤN</Badge>
            <h2 className="modal-title-quantum">{t.title}</h2>
            <div className="product-info-bar">
              <Package size={16} className="text-primary" />
              <span>SẢN PHẨM: {product.name}</span>
            </div>
          </header>

          {status === "success" ? (
            <div className="modal-success-quantum">
              <div className="success-icon-quantum">
                <Check size={32} />
              </div>
              <p className="success-msg-quantum">{t.success}</p>
            </div>
          ) : (
            <form className="modal-form-quantum" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label>{t.name}</label>
                  <Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full Name" />
                </div>
                <div className="form-field">
                  <label>{t.email}</label>
                  <Input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@address.com" />
                </div>
                <div className="form-field full">
                  <label>{t.message}</label>
                  <textarea 
                    required 
                    rows={3}
                    className="quantum-textarea"
                    placeholder="Describe your requirements..."
                    value={form.message} 
                    onChange={e => setForm({...form, message: e.target.value})} 
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full mt-4" disabled={status === "submitting"}>
                {status === "submitting" ? <Loader2 className="animate-spin" size={20} /> : t.submit}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Catalog;
