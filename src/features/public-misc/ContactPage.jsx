import { useState } from "react";

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "sales", message: "" });
  const [status, setStatus] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact-page",
          name: form.name,
          email: form.email,
          message: `[${form.topic}] ${form.message}`,
        }),
      });
      setStatus("ok");
      setForm({ name: "", email: "", topic: "sales", message: "" });
    } catch {
      setStatus("err");
    }
  };

  return (
    <div className="contact-page-v2">
      <header className="contact-hero">
        <div className="contact-hero__inner">
          <h1>Lin h? Pi Ecosystem</h1>
          <p>
        B?n c cu h?i v? bundles, c?n demo cho team, ho?c mu?n deal Max?
            Ch?n knh nhanh nh?t bn du?i  tr? l?i trong 24h gi? hnh chnh.
          </p>
        </div>
      </header>

      <div className="contact-body">
        <section className="contact-channels-v2">
          <h2> Knh lin h?</h2>
          <div className="channel-grid">
            <a href="mailto:support@piwebagency.com" className="channel-card-v2">
              <div className="channel-icon"></div>
              <h3>Support</h3>
              <p>Bug, cu h?i k? thu?t, h? tr? ci d?t</p>
              <span className="channel-action">support@piwebagency.com</span>
            </a>
            <a href="mailto:sales@piwebagency.com" className="channel-card-v2 channel-card-v2--primary">
              <div className="channel-icon"></div>
              <h3>Sales</h3>
              <p>Bundle ty chnh, Max deal, enterprise</p>
              <span className="channel-action">sales@piwebagency.com</span>
            </a>
            <a href="https://zalo.me/pi-ecosystem" target="_blank" rel="noreferrer" className="channel-card-v2">
              <div className="channel-icon"></div>
              <h3>Zalo OA</h3>
              <p>Chat nhanh, gi? hnh chnh VN</p>
              <span className="channel-action">M? Zalo ?</span>
            </a>
            <a href="https://github.com/piwebagency/issues" target="_blank" rel="noreferrer" className="channel-card-v2">
              <div className="channel-icon"></div>
              <h3>Bug tracker</h3>
              <p>Public GitHub issues, community-tracked</p>
              <span className="channel-action">GitHub Issues ?</span>
            </a>
          </div>
        </section>

        <section className="contact-form-section">
          <div className="contact-form-grid">
            <div className="contact-form-side">
              <h2>Ho?c g?i message</h2>
              <p className="muted">
                Form ny s? du?c g?i ti team Pi d?a vo ch? d? b?n ch?n.
              </p>
              <ul className="contact-facts">
                <li> Tr? l?i trong 24h ngy lm vi?c</li>
                <li> Team 100% Vi?t Nam</li>
                <li> D liu khng share v?i third party</li>
                <li> Support ti?ng Vi?t + English</li>
              </ul>
            </div>

            <form onSubmit={onSubmit} className="contact-form-v2">
              <div className="form-row">
                <label>
                  <span>Tn c?a b?n</span>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nguy?n Van A" />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
                </label>
              </div>
              <label>
                <span>Ch? d?</span>
                <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                  <option value="sales"> Bn hng / Bundle</option>
                  <option value="support"> H? tr? k? thu?t</option>
                  <option value="bug"> Bo l?i</option>
                  <option value="feature"> ? xu?t tnh nang</option>
                  <option value="partnership"> H?p tc</option>
                  <option value="other"> Khc</option>
                </select>
              </label>
              <label>
                <span>N?i dung</span>
                <textarea rows={6} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="M t? yu c?u. Cng chi ti?t cng d? tr? l?i nhanh." />
              </label>
              <button type="submit" className="btn-contact" disabled={status === "sending"}>
                {status === "sending" ? "ang g?i" : "G?i message "}
              </button>
              {status === "ok" && <div className="contact-alert contact-alert--ok">?  g?i! C?m on  chng ti s? ph?n h?i trong 24h.</div>}
              {status === "err" && <div className="contact-alert contact-alert--err">G?i tht bi. Th? email tr?c ti?p nh.</div>}
            </form>
          </div>
        </section>

        <section className="contact-office">
          <h2> V? team Pi</h2>
          <div className="office-grid">
            <div>
              <h3>Pi Web Agency</h3>
              <p>?a ch?: TP. H? Ch Minh, Vi?t Nam</p>
            </div>
            <div>
              <h3>Gi? lm vi?c</h3>
              <p>Th? 2  Th? 6: 9:00  18:00 (GMT+7)</p>
              <p>Th? 7: 9:00  12:00 (Zalo)</p>
            </div>
            <div>
              <h3>Ngn ng?</h3>
              <p>Ti?ng Vi?t (primary)</p>
              <p>English (secondary)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ContactPage;
