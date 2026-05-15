
import { Link } from "react-router-dom";

import { Button } from "@/_shared/components/ui";
import {
  ArrowRight,
  LayoutGrid,
  Flag,
  Zap,
  Copy,
  Monitor,
  Activity,
  MessageSquare,
} from "lucide-react";
import './HomeHero.css';

/* ─────────────────────────────────────────────────────────────
 * Hero preview — mirror of real Pi Dashboard layout
 *   • top tab nav (NỘI DUNG / SEO / MARKETING / VẬN HÀNH / DOANH NGHIỆP)
 *   • system-status banner
 *   • 4 stat tiles (Bài viết, Thư viện, Khách hàng, AI Chat)
 *   • token wallet footer
 * No fake SVG chart — content mirrors what user actually sees.
 * ──────────────────────────────────────────────────────────── */
export function HomeHero({ t }) {
  if (!t || !t.hero) return null;

  return (
    <section className="home-section home-hero">
      <div className="mx-auto w-full max-w-[1400px] px-8 lg:px-20">
        <div className="home-hero__grid">
          {/* ─── Copy ─── */}
          <div className="home-hero__copy">
            <div className="home-hero__badge">
              {t?.hero?.saleBadge} {t?.hero?.eyebrow}
            </div>

            <h1 className="home-hero__title">
              {t?.hero?.title}
              <span>{t?.hero?.subtitle}</span>
            </h1>

            <p className="home-hero__desc">{t?.hero?.description}</p>

            <div className="home-hero__actions">
              <Button as={Link} to="/pricing" variant="primary" size="lg">
                {t?.hero?.ctaPrimary}
              </Button>
              <Button as={Link} to="/about" variant="ghost" size="lg">
                {t?.hero?.ctaSecondary} <ArrowRight size={16} />
              </Button>
            </div>

            <div className="home-hero__stats" aria-label="Pi ecosystem highlights">
              <div><strong>5K</strong><span>{t?.hero?.stats?.freeTokens || "free tokens/mo"}</span></div>
              <div><strong>3</strong><span>{t?.hero?.stats?.tiers || "tiers"}</span></div>
              <div><strong>VN</strong><span>{t?.hero?.stats?.market || "Vietnam market"}</span></div>
            </div>
          </div>

          {/* ─── Dashboard mock (mirrors real pi-dashboard) ─── */}
          <div className="home-hero__product" aria-label="Pi Dashboard preview">
            <div className="pd-window">
              {/* Browser chrome */}
              <div className="pd-header">
                <div className="pd-dots"><span /><span /><span /></div>
                <div className="pd-title" />
              </div>

              {/* App body — top tab nav + content */}
              <div className="pd-body pd-body--stacked">
                {/* Top tab nav — marquee right→left, seamless loop via duplicate */}
                <nav className="pd-tabnav" aria-label="Pi Dashboard navigation">
                  <div className="pd-tabnav-track">
                    {[0, 1].map((dup) => (
                      <div className="pd-tabnav-group" aria-hidden={dup === 1} key={dup}>
                        <span className="pd-tab active">Nội dung</span>
                        <span className="pd-tab">SEO</span>
                        <span className="pd-tab">Marketing</span>
                        <span className="pd-tab">Vận hành</span>
                        <span className="pd-tab">Doanh nghiệp</span>
                        <span className="pd-tab">Phím tắt</span>
                        <span className="pd-tab">Trợ giúp</span>
                      </div>
                    ))}
                  </div>
                </nav>

                <div className="pd-main">
                  {/* System status banner */}
                  <div className="pd-status-banner">
                    <span className="pd-status-led" />
                    <div className="pd-status-text">
                      <span className="pd-status-title">Hệ thống đang vận hành</span>
                      <span className="pd-status-sub-en">All systems operational</span>
                    </div>
                    <span className="pd-status-version">v2.5.0</span>
                  </div>

                  {/* 4 stat tiles */}
                  <div className="pd-tiles">
                    <div className="pd-tile">
                      <div className="pd-tile-head">
                        <Copy size={11} /> <span>Bài viết</span>
                      </div>
                      <div className="pd-tile-value">172</div>
                      <div className="pd-tile-delta">+ 1 tuần này</div>
                    </div>
                    <div className="pd-tile">
                      <div className="pd-tile-head">
                        <Monitor size={11} /> <span>Thư viện</span>
                      </div>
                      <div className="pd-tile-value">920</div>
                      <div className="pd-tile-delta pd-tile-delta--muted">tệp media</div>
                    </div>
                    <div className="pd-tile">
                      <div className="pd-tile-head">
                        <Activity size={11} /> <span>Khách hàng</span>
                      </div>
                      <div className="pd-tile-value">47</div>
                      <div className="pd-tile-delta">+ 8 tuần này</div>
                    </div>
                    <div className="pd-tile">
                      <div className="pd-tile-head">
                        <MessageSquare size={11} /> <span>AI Chat</span>
                      </div>
                      <div className="pd-tile-value">284</div>
                      <div className="pd-tile-delta">hội thoại 30d</div>
                    </div>
                  </div>

                  {/* Wallet footer */}
                  <div className="pd-wallet">
                    <Zap size={11} className="pd-wallet-icon" />
                    <span className="pd-wallet-label">Token ví:</span>
                    <span className="pd-wallet-value">4,280 / 50,000</span>
                    <span className="pd-wallet-sep">·</span>
                    <span className="pd-wallet-meta">Gói Pro · còn 26 ngày</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating tooltips — value props */}
            <div className="pd-float-tooltip top-right">
              <div className="tooltip-header">
                <LayoutGrid size={14} className="tooltip-icon" />
                <span>5 KHU VỰC LÀM VIỆC</span>
              </div>
              <div className="tooltip-chips">
                <span>Nội dung</span>
                <span>SEO</span>
                <span>Marketing</span>
                <span>Vận hành</span>
                <span>Doanh nghiệp</span>
              </div>
            </div>

            <div className="pd-float-tooltip bottom-left">
              <div className="tooltip-header">
                <Flag size={14} className="tooltip-icon" />
                <span>MAY ĐO CHO VIỆT NAM</span>
              </div>
              <div className="tooltip-text">
                Tiếng Việt chuẩn, hosting trong nước, hỗ trợ 8h–22h giờ VN.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
