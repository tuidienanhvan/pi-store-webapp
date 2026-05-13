import { useAuth } from "@/context/AuthContext";

import { Card } from "@/components/ui";



export function ProfilePage() {

  const { user } = useAuth();



  return (

    <div className="stack" style={{ gap: "var(--s-8)" }}>

      <header className="stack" style={{ gap: "var(--s-2)" }}>

        <h1 style={{ margin: 0, fontSize: "var(--fs-32)" }}>H? so</h1>

        <p style={{ margin: 0, color: "color-mix(in srgb, var(--base-content) 80%, transparent)", fontSize: "var(--fs-18)" }}>Thng tin ti kho?n Pi c?a b?n.</p>

      </header>



      <div className="stack" style={{ gap: "var(--s-8)" }}>

        <Card className="stack" style={{ padding: 0, overflow: "hidden" }}>

          <div className="grid grid-cols-3" style={{ background: "var(--base-300)", gap: "1px" }}>

            <div style={{ background: "var(--base-200)", padding: "var(--s-5)" }}>

              <div style={{ color: "color-mix(in srgb, var(--base-content) 80%, transparent)", fontSize: "var(--fs-14)", marginBottom: "var(--s-2)" }}>Email</div>

              <div style={{ fontWeight: "500", color: "var(--base-content)" }}>{user?.email}</div>

            </div>

            <div style={{ background: "var(--base-200)", padding: "var(--s-5)" }}>

              <div style={{ color: "color-mix(in srgb, var(--base-content) 80%, transparent)", fontSize: "var(--fs-14)", marginBottom: "var(--s-2)" }}>Tn</div>

              <div style={{ fontWeight: "500", color: "var(--base-content)" }}>{user?.name || ""}</div>

            </div>

            <div style={{ background: "var(--base-200)", padding: "var(--s-5)" }}>

              <div style={{ color: "color-mix(in srgb, var(--base-content) 80%, transparent)", fontSize: "var(--fs-14)", marginBottom: "var(--s-2)" }}>Ti kho?n t?o</div>

              <div style={{ fontWeight: "500", color: "var(--base-content)" }}>

                {user?.created_at

                  ? new Date(user.created_at).toLocaleDateString("vi-VN")

                  : ""}

              </div>

            </div>

          </div>

        </Card>



        <section className="stack" style={{ gap: "var(--s-4)" }}>

          <h2 style={{ margin: 0, fontSize: "var(--fs-24)" }}>?i m?t kh?u</h2>

          <p style={{ margin: 0, color: "color-mix(in srgb, var(--base-content) 80%, transparent)", fontSize: "var(--fs-14)" }}>

            Feature ny s? du?c thm ? Phase 2 (<code style={{ color: "var(--primary)" }}>POST /v1/auth/password</code>).

          </p>

        </section>

      </div>

    </div>

  );

}

