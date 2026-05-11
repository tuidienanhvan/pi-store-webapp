import { Link } from "react-router-dom";
import { SeoMeta } from "@/components/core/SeoMeta";
import { Button, Icon } from "@/components/ui";

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

      <section className="container pt-24 pb-16 text-center stack gap-8 items-center animate-in">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 shadow-4">
          <Icon name="pi" size={48} />
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
            Xem b?ng gi & ang k
          </Button>
          <Button as={Link} to="/docs" variant="outline" size="lg" className="px-8 font-bold glass border-hairline">
            Xem ti li?u
          </Button>
        </div>
      </section>

      <section className="bg-base-200-2 border-y border-hairline py-20">
        <div className="container grid grid-cols-3 gap-8">
          <div className="stack gap-4 p-8 glass rounded-2xl border border-hairline">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Icon name="box" size={24} />
            </div>
            <h3 className="text-xl font-bold m-0">1 Plugin duy nh?t</h3>
            <p className="muted m-0 leading-relaxed text-15">
              Ci d?t plugin <code>pi-api</code> trn thu vi?n WordPress. Khng c?n ti r?i tng tnh nang.
            </p>
          </div>
          <div className="stack gap-4 p-8 glass rounded-2xl border border-hairline">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Icon name="key" size={24} />
            </div>
            <h3 className="text-xl font-bold m-0">License linh ho?t</h3>
            <p className="muted m-0 leading-relaxed text-15">
              ang k ti kho?n Pi Ecosystem d? nh?n license. Nng c?p hay h? c?p gi d? dng t? Dashboard.
            </p>
          </div>
          <div className="stack gap-4 p-8 glass rounded-2xl border border-hairline">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Icon name="zap" size={24} />
            </div>
            <h3 className="text-xl font-bold m-0">AI Cloud Tokens</h3>
            <p className="muted m-0 leading-relaxed text-15">
              Tt c cc tnh nang nng cao dng chung m?t v AI token. Ti?t ki?m ti da chi ph v?n hnh.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-24 text-center">
        <h2 className="text-4xl font-bold m-0 mb-4">S?n sng d? b?t d?u?</h2>
        <p className="text-lg muted mb-10 max-w-xl mx-auto">
          Tham gia cng hng ngn website WordPress khc dang s? d?ng Pi Ecosystem d? tang tru?ng mi ngy.
        </p>
        <Button as={Link} to="/signup?plan=free" variant="primary" size="lg" className="px-10 py-4 font-bold text-lg shadow-4 hover:shadow-5 transition-shadow">
          B?t d?u mi?n ph ngay
        </Button>
      </section>
    </>
  );
}

export default ProductEcosystemPage;
