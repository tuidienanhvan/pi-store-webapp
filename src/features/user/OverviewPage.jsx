import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import { api } from "@/_shared/api/api-client";

import { useAuth } from "@/_shared/context/AuthContext";

import { Alert, Badge, Button, Card, EmptyState, Skeleton } from "@/_shared/components/ui";
import { Bolt, Zap, Layers, ArrowRight } from "lucide-react";
import './OverviewPage.css';



export function UserOverviewPage() {

  const { user } = useAuth();

  const [pkg, setPkg] = useState(null);

  const [usage, setUsage] = useState(null);

  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  const [err, setErr] = useState("");



  useEffect(() => {

    let mounted = true;

    (async () => {

      try {

        const [p, u, s] = await Promise.all([api.cloud.myPackage().catch(() => null), api.cloud.myUsage(30).catch(() => null), api.license.stats().catch(() => null)]);

        if (!mounted) return;

        setPkg(p);

        setUsage(u);

        setStats(s);

      } catch (e) {

        if (mounted) setErr(e.message);

      } finally {

        if (mounted) setLoading(false);

      }

    })();

    return () => {

      mounted = false;

    };

  }, []);



  return (

    <div className="stack gap-8">

      <header className="stack gap-2">

        <h1 className="m-0 text-32">Hello {user?.name || user?.email}</h1>

        <p className="m-0 text-lg muted">Pi AI Cloud overview for your current billing cycle.</p>

      </header>



      {err && <Alert tone="danger">{err}</Alert>}



      {loading ? (

        <SkeletonDashboard />

      ) : !pkg ? (

        <NoPackageState />

      ) : (

        <>

          <QuotaCard pkg={pkg} />

<div className="grid grid-cols-3 gap-4">

            <MiniStat label="Calls this month" value={pkg.current_period_requests} icon={Bolt} />
            <MiniStat label="Lifetime tokens" value={formatNum(pkg.lifetime_tokens_used)} icon={Zap} />
            <MiniStat label="License sites" value={`${stats?.activated_sites || 0} / ${stats?.max_sites || "-"}`} icon={Layers} />

          </div>

          <UsageChart usage={usage} />

        </>

      )}

    </div>

  );

}



function QuotaCard({ pkg }) {

  const limit = pkg.token_quota_monthly;

  const used = pkg.current_period_tokens_used;

  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;

  const pctColor = pct >= 90 ? "var(--danger)" : pct >= 70 ? "var(--warning)" : "var(--primary)";

  const daysLeft = useMemo(() => {

    const start = new Date(pkg.current_period_started_at);

    const end = new Date(start);

    end.setMonth(end.getMonth() + 1);

    return Math.max(0, Math.ceil((end - new Date()) / 86400000));

  }, [pkg.current_period_started_at]);



  return (

    <Card className="p-6">

      <div className="row justify-between items-start flex-wrap gap-3 mb-5">

        <div className="stack gap-1">

          <div className="text-13 muted uppercase tracking-wider">Current package</div>

          <div className="row gap-2">

            <h2 className="m-0 text-3xl">{pkg.package_name}</h2>

            <Badge tone={pkg.status === "active" ? "success" : "warning"}>{pkg.status}</Badge>

          </div>

          <div className="text-13 text-base-content/60">Remaining: {daysLeft} days in this cycle</div>

        </div>

        <Button as={Link} to="/pricing" variant="ghost">

          Upgrade <ArrowRight size={14} />

        </Button>

      </div>



      <div className="stack gap-2">

        <div className="row justify-between text-sm muted">

          <span>Tokens used</span>

          <span>

            <strong className="text-base-content">{formatNum(used)}</strong>

            {limit > 0 ? ` / ${formatNum(limit)} (${pct.toFixed(1)}%)` : " / 8"}

          </span>

        </div>

        <div style={{ height: 10, background: "var(--base-300)", borderRadius: 999, overflow: "hidden" }}>

          <div style={{ width: `${pct}%`, height: "100%", background: pctColor }} />

        </div>

      </div>

    </Card>

  );

}



function MiniStat({ label, value, icon: IconComponent }) {

  return (

    <Card className="p-5">

      <div className="row justify-between items-start">

        <div>

          <div className="text-13 muted">{label}</div>

          <div className="text-28 font-semibold text-base-content mt-1">{value}</div>

        </div>

        <IconComponent size={20} className="text-base-content/60" />

      </div>

    </Card>

  );

}



function UsageChart({ usage }) {

  const daily = usage?.daily || [];

  if (daily.length === 0) {

    return (

      <Card className="p-6">

        <h3 className="m-0 mb-3 text-lg">Usage 30 days</h3>

        <EmptyState title="No data yet" description="Start calling APIs to see usage charts." />

      </Card>

    );

  }

  const max = Math.max(...daily.map((d) => d.tokens), 1);

  return (

    <Card className="p-6">

      <h3 className="m-0 mb-4 text-lg">Usage 30 days</h3>

      <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 120 }}>

        {daily.map((d) => (

          <div key={d.date} style={{ flex: 1 }}>

            <div style={{ height: `${Math.max(2, (d.tokens / max) * 100)}%`, background: "var(--primary)", borderRadius: "2px 2px 0 0" }} />

          </div>

        ))}

      </div>

    </Card>

  );

}



function SkeletonDashboard() {

  return (

    <>

      <Card className="p-6">

        <Skeleton style={{ height: 120 }} />

      </Card>

      <div className="grid grid-cols-3 gap-4">

        <Skeleton style={{ height: 88 }} />

        <Skeleton style={{ height: 88 }} />

        <Skeleton style={{ height: 88 }} />

      </div>

    </>

  );

}



function NoPackageState() {

  return (

    <Card className="p-8 text-center">

      <EmptyState title="No package found" description="Choose a package to start using AI tokens." action={<Button as={Link} to="/pricing">View pricing</Button>} />

    </Card>

  );

}



function formatNum(n) {

  if (!n && n !== 0) return "-";

  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;

  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;

  return n.toLocaleString();

}


export default UserOverviewPage;
