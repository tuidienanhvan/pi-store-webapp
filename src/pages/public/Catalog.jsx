import React, { useState, useMemo } from "react";

import { Link } from "react-router-dom";

import { useLocale } from "@/context/LocaleContext";

import { Input, Button, Card, Badge, Icon } from "@/components/ui";

import "./catalog.css";



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



  return (

    <div className="catalog-page page-enter">

      <header className="catalog-hero">

        <div className="container">

          <div className="catalog-hero__inner">

            <h1 className="catalog-title">{t.heading}</h1>

            <p className="catalog-subtitle">{t.shelfHint}</p>

            

            <div className="catalog-search-container">

              <div className="catalog-search-box group">

                <Icon name="search" className="search-icon" size={24} />

                <input 

                  type="text" 

                  placeholder={t.searchPlaceholder}

                  value={search}

                  onChange={(e) => setSearch(e.target.value)}

                  className="catalog-search-input"

                />

              </div>

              

              <div className="catalog-filter-row">

                {categories.map(cat => (

                  <button

                    key={cat.id}

                    className={`cat-pill ${category === cat.id ? "is-active" : ""}`}

                    onClick={() => setCategory(cat.id)}

                  >

                    {cat.label}

                  </button>

                ))}

              </div>

            </div>

          </div>

        </div>

      </header>



      <main className="container py-24">

        <div className="catalog-header-meta">

          <span className="results-count">

            {t.resultCount(filtered.length)}

          </span>

        </div>



        <div className="catalog-grid">

          {filtered.map(p => (

            <Card key={p.id} className="catalog-item-card">

              <div className="catalog-item-card__visual">

                <div className="catalog-item-icon">

                  <Icon name={p.type === "platform" ? "layers" : "zap"} size={32} />

                </div>

                <Badge tone={p.type === "platform" ? "brand" : "info"}>{p.type}</Badge>

              </div>

              

              <div className="catalog-item-card__content stack gap-4">

                <h3 className="catalog-item-name">{p.name}</h3>

                <p className="catalog-item-tagline">{p.tagline}</p>

              </div>



              <div className="catalog-item-card__footer">

                <div className="catalog-item-price">

                  {p.priceUsd != null ? (

                    <>

                      <span className="price-val">${p.priceUsd}</span>

                      <span className="price-unit">/ once</span>

                    </>

                  ) : (

                    <span className="price-val">{p.tiers ? "Sub" : "Contact"}</span>

                  )}

                </div>

                

                <div className="catalog-item-actions">

                  <Button as={Link} to={p.id === "pi-ecosystem" ? "/product/pi-ecosystem" : "/pricing"} variant="ghost" size="sm" className="w-full">

                    Details

                  </Button>

                  <Button variant="primary" size="sm" className="w-full" onClick={() => setLeadProduct(p)}>

                    Inquire

                  </Button>

                </div>

              </div>

            </Card>

          ))}

        </div>

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

      // Mock API call

      await new Promise(r => setTimeout(r, 1000));

      setStatus("success");

      setTimeout(onClose, 2000);

    } catch {

      setStatus("error");

    }

  };



  return (

    <div className="lead-modal-overlay" onClick={onClose}>

      <div className="lead-modal-card animate-in" onClick={e => e.stopPropagation()}>

        <button className="modal-close-btn" onClick={onClose}><Icon name="x" size={20} /></button>

        <div className="stack gap-8">

          <header className="stack gap-2">

            <h2 className="modal-title">{t.title}</h2>

            <p className="modal-desc">{t.desc}</p>

            <div className="modal-product-tag">

              <Icon name="package" className="text-primary" size={18} />

              <span>{product.name}</span>

            </div>

          </header>



          {status === "success" ? (

            <div className="modal-success-state">

              <div className="success-icon-wrap">

                <Icon name="check" size={32} />

              </div>

              <p className="success-msg">{t.success}</p>

            </div>

          ) : (

            <form className="stack gap-6" onSubmit={handleSubmit}>

              <div className="stack gap-4">

                <label className="field-label stack gap-2">

                  <span>{t.name}</span>

                  <Input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Jane Doe" />

                </label>

                <label className="field-label stack gap-2">

                  <span>{t.email}</span>

                  <Input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="jane@example.com" />

                </label>

                <label className="field-label stack gap-2">

                  <span>{t.message}</span>

                  <textarea 

                    required 

                    rows={4}

                    className="catalog-textarea"

                    placeholder="..."

                    value={form.message} 

                    onChange={e => setForm({...form, message: e.target.value})} 

                  />

                </label>

              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={status === "submitting"}>

                {status === "submitting" ? <Icon name="loader" className="animate-spin" size={20} /> : t.submit}

              </Button>

            </form>

          )}

        </div>

      </div>

    </div>

  );

}


export default Catalog;
