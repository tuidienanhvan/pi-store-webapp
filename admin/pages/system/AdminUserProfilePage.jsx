import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api, withDelay } from "@/lib/api-client";
import { useAdminT, formatDate, formatCurrencyUSD } from "@/lib/translations";
import { Card, Button, Input, Badge, IconButton, Alert } from "@/components/ui";
import { UserX, ArrowLeft, Clock, LogIn, Globe, Key, EyeOff, Eye, Copy, ShieldCheck, Save, Lightbulb } from "lucide-react";
import { AdminTableSkeleton } from "@/components/skeletons/AdminTableSkeleton";
import { toast } from "sonner";

import "./AdminUserProfilePage.css";

export function AdminUserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useAdminT();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [siteUrl, setSiteUrl] = useState("");
  const [appPassword, setAppPassword] = useState("");

  useEffect(() => {
    setLoading(true);
    withDelay(api.admin.getUser(id), 800)
      .then((res) => {
        setUser(res);
        setSiteUrl(res.site_url || "");
        setAppPassword(res.application_password || "");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Khng th ti thng tin ngi dng");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.admin.updateUserProfile(id, {
        site_url: siteUrl,
        application_password: appPassword,
      });
      setUser(updated);
      toast.success(" cp nht h s khch hng");
    } catch (err) {
      console.error(err);
      toast.error("Li khi cp nht h s");
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(" sao chp vo b nh tm");
  };

  if (loading) return <AdminTableSkeleton />;
  if (!user) return (
    <div className="p-10 text-center">
      <UserX size={48} className="mx-auto opacity-20 mb-4" />
      <h2 className="text-xl font-bold">Khng tm thy ngi dng</h2>
      <Button variant="ghost" onClick={() => navigate("/admin/users")} className="mt-4">Quay li danh sch</Button>
    </div>
  );

  return (
    <div className="user-profile-page fade-in">
      <header className="profile-header stagger-1">
        <div className="flex items-center gap-4">
          <Link to="/admin/users" className="group">
            <IconButton icon={ArrowLeft} label="Quay li" variant="ghost" className="group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="premium-title">{t.profile_details || "H s khch hng"}</h1>
            <p className="text-base-content/60 font-medium opacity-60">
              ID: <span className="text-primary font-mono">{user.id}</span>  {user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <Badge tone={user.is_admin ? "primary" : "neutral"} className="uppercase text-[10px] font-black tracking-[0.2em] px-4 py-1.5">
             {user.is_admin ? "Administrator" : "Customer Account"}
           </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 flex flex-col gap-6 stagger-2">
          <Card className="profile-card overflow-hidden">
            <div className="relative h-32 bg-gradient-to-br from-primary/20 to-info/20 overflow-hidden">
               <div className="absolute inset-0 backdrop-blur-3xl" />
               <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            </div>
            
            <div className="px-8 pb-8 -mt-12 relative flex flex-col items-center text-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-tr from-primary to-info rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity" />
                <img 
                  src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${user.email}&backgroundColor=b6e3f4,c0aede,d1d4f9`} 
                  alt={user.name}
                  className="relative w-24 h-24 rounded-[2rem] bg-base-100 object-cover border-4 border-base-200 shadow-xl"
                />
              </div>
              
              <h2 className="mt-4 text-xl font-black text-base-content tracking-tight">{user.name || "Cha t tn"}</h2>
              <p className="text-sm text-base-content/50 font-medium">{user.email}</p>
              
              <div className="w-full h-px bg-base-border-subtle my-6 opacity-40" />
              
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col items-center p-3 bg-base-content/[0.03] rounded-2xl">
                   <span className="text-[10px] font-black uppercase text-base-content/40 tracking-widest mb-1">License</span>
                   <span className="text-lg font-mono font-bold text-primary">{user.license_count || 0}</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-base-content/[0.03] rounded-2xl">
                   <span className="text-[10px] font-black uppercase text-base-content/40 tracking-widest mb-1">S d</span>
                   <span className="text-lg font-mono font-bold text-success">{formatCurrencyUSD(user.token_balance || 0)}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 flex flex-col gap-4 bg-base-200/20">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-xl bg-info/10 flex items-center justify-center text-info">
                 <Clock size={16} />
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">ng k ngy</span>
                 <span className="text-xs font-bold">{formatDate(user.created_at, "vi")}</span>
               </div>
             </div>
             
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                 <LogIn size={16} />
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">Ln cui ng nhp</span>
                 <span className="text-xs font-bold">{user.last_login_at ? formatDate(user.last_login_at, "vi") : "Cha c"}</span>
               </div>
             </div>
          </Card>
        </div>

        {/* Form Area */}
        <div className="lg:col-span-2 stagger-3">
          <Card className="p-8 lg:p-10 flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-black tracking-tight flex items-center gap-3">
                <div className="w-2 h-6 bg-primary rounded-full" />
                Thng tin k thut (System Metadata)
              </h3>
              <p className="text-sm text-base-content/50 font-medium">
                Qun l cc thng tin dng  kt ni Pi Backend vi Website ca khch hng.
              </p>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-2.5">
                  <label className="text-[11px] font-black uppercase tracking-[0.15em] text-base-content/50 ml-1">
                    a ch Website (Site URL)
                  </label>
                  <Input 
                    placeholder="https://example.com"
                    leadingIcon={Globe}
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    className="h-14 px-5 text-base font-medium rounded-2xl border-base-border-subtle focus:ring-primary/20"
                  />
                  <p className="text-[10px] text-base-content/40 italic ml-1">URL trang WordPress khch hng ang s dng plugin.</p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <label className="text-[11px] font-black uppercase tracking-[0.15em] text-base-content/50 ml-1">
                    Application Password
                  </label>
                  <div className="relative group/field">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="xxxx xxxx xxxx xxxx"
                      leadingIcon={Key}
                      value={appPassword}
                      onChange={(e) => setAppPassword(e.target.value)}
                      className="h-14 px-5 pr-28 text-base font-mono font-medium rounded-2xl border-base-border-subtle focus:ring-primary/20"
                    />
                    <div className="absolute right-2 top-2 flex items-center gap-1">
                      <IconButton 
                        icon={showPassword ? EyeOff : Eye} 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="hover:bg-base-content/5"
                      />
                      <IconButton 
                        icon={Copy} 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => copyToClipboard(appPassword)}
                        className="hover:bg-base-content/5"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-base-content/40 italic ml-1">Mt khu ng dng dng  gi REST API (Application Passwords trong WP).</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-base-border-subtle opacity-80">
                <div className="flex items-center gap-3 text-info text-xs font-bold">
                   <ShieldCheck size={16} />
                   <span>D liu c bo v bi Pi Security Protocol</span>
                </div>
                
                <Button 
                  type="submit" 
                  variant="primary" 
                  loading={saving}
                  disabled={saving}
                  className="h-14 px-10 rounded-2xl shadow-primary/20 shadow-xl font-black uppercase tracking-widest text-xs"
                >
                  <Save size={18} className="mr-2" />
                  Lu thay i
                </Button>
              </div>
            </form>
          </Card>

          {/* Tips Section */}
          <div className="mt-8">
             <Alert tone="info" className="bg-info/5 border-info/10 rounded-[2rem] p-6">
               <div className="flex gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-info/10 flex items-center justify-center text-info shrink-0">
                   <Lightbulb size={24} />
                 </div>
                 <div className="flex flex-col gap-1">
                   <h4 className="font-bold text-info">Hng dn bo mt</h4>
                   <p className="text-sm text-info/70 font-medium leading-relaxed">
                     Bn c th dng Application Password ca WordPress  cho php Pi AI Cloud thc hin cc tc v t ng trn site khch hng nh: 
                     ng bi vit mi, Cp nht SEO Meta, hoc Kim tra hiu nng nh k m khng cn mt khu chnh.
                   </p>
                 </div>
               </div>
             </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}
