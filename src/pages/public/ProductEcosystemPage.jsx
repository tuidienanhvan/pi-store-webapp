import { Link } from "react-router-dom";
import { SeoMeta } from "@/components/core/SeoMeta";
import { Button } from "@/components/ui";
import { Box, Key, Zap } from "lucide-react";
import PiLogo from "@pi-ui/base/PiLogo";

export function ProductEcosystemPage({ products, siteUrl }) {
  const product = products.find(p => p.id === "pi-ecosystem");
  
  if (!product) return null;

  return (
    <>
      <SeoMeta
        title={`${product.name} | PI Ecosystem Store`}
        description={product.tagline}
        siteUrl={siteUrl}
        pathname="/product/pi-ecosystem"
      />

      <section className="mx-auto w-full max-w-[1400px] px-8 pt-24 pb-16 text-center stack gap-8 items-center animate-in">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 shadow-4">
          <PiLogo size={48} />
        </div>
        <div className="stack gap-4 max-w-2xl">
          <h1 className="text-5xl m-0 font-bold tracking-tight">{product.name}</h1>
          <p className="text-xl muted m-0 leading-relaxed font-medium">
            {product.tagline}
          </p>
          <p className="text-base muted m-0">
            {product.longDescription}
          </p>
        </div>
        
        <div className="row gap-4 mt-4">
          <Button as={Link} to="/pricing" variant="primary" size="lg" className="px-8 font-bold shadow-4">
            Xem bảng giá & đăng ký
          </Button>
          <Button as={Link} to="/docs" variant="outline" size="lg" className="px-8 font-bold glass border-hairline">
            Xem tài liệu
          </Button>
        </div>
      </section>

      <section className="bg-base-200-2 border-y border-hairline py-20">
        <div className="mx-auto w-full max-w-[1400px] px-8 grid grid-cols-3 gap-8">
          <div className="stack gap-4 p-8 glass rounded-2xl border border-hairline">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Box size={24} />
            </div>
            <h3 className="text-xl font-bold m-0">1 Plugin duy nhất</h3>
            <p className="muted m-0 leading-relaxed text-15">
              Cài đặt plugin <code>pi-api</code> trên thư viện WordPress. Không cần tải rời từng tính năng.
            </p>
          </div>
          <div className="stack gap-4 p-8 glass rounded-2xl border border-hairline">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Key size={24} />
            </div>
            <h3 className="text-xl font-bold m-0">License linh hoạt</h3>
            <p className="muted m-0 leading-relaxed text-15">
              Đăng ký tài khoản Pi Ecosystem để nhận license. Nâng cấp hay hạ cấp gói dễ dàng từ Dashboard.
            </p>
          </div>
          <div className="stack gap-4 p-8 glass rounded-2xl border border-hairline">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold m-0">AI Cloud Tokens</h3>
            <p className="muted m-0 leading-relaxed text-15">
              Tất cả các tính năng nâng cao dùng chung một ví AI token. Tiết kiệm tối đa chi phí vận hành.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-8 py-24 text-center">
        <h2 className="text-4xl font-bold m-0 mb-4">Sẵn sàng để bắt đầu?</h2>
        <p className="text-lg muted mb-10 max-w-xl mx-auto">
          Tham gia cùng hàng ngàn website WordPress khác đang sử dụng Pi Ecosystem để tăng trưởng mỗi ngày.
        </p>
        <Button as={Link} to="/signup?plan=free" variant="primary" size="lg" className="px-10 py-4 font-bold text-lg shadow-4 hover:shadow-5 transition-shadow">
          Bắt đầu miễn phí ngay
        </Button>
      </section>
    </>
  );
}

export default ProductEcosystemPage;
