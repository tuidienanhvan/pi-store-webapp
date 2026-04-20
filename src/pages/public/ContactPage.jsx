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
          <h1>Liên hệ Pi Ecosystem</h1>
          <p>
            Bạn có câu hỏi về bundles, cần demo cho team, hoặc muốn deal agency?
            Chọn kênh nhanh nhất bên dưới — trả lời trong 24h giờ hành chính.
          </p>
        </div>
      </header>

      <div className="contact-body">
        <section className="contact-channels-v2">
          <h2>📬 Kênh liên hệ</h2>
          <div className="channel-grid">
            <a href="mailto:support@piwebagency.com" className="channel-card-v2">
              <div className="channel-icon">💬</div>
              <h3>Support</h3>
              <p>Bug, câu hỏi kỹ thuật, hỗ trợ cài đặt</p>
              <span className="channel-action">support@piwebagency.com</span>
            </a>
            <a href="mailto:sales@piwebagency.com" className="channel-card-v2 channel-card-v2--primary">
              <div className="channel-icon">🤝</div>
              <h3>Sales</h3>
              <p>Bundle tùy chỉnh, agency deal, enterprise</p>
              <span className="channel-action">sales@piwebagency.com</span>
            </a>
            <a href="https://zalo.me/pi-ecosystem" target="_blank" rel="noreferrer" className="channel-card-v2">
              <div className="channel-icon">📱</div>
              <h3>Zalo OA</h3>
              <p>Chat nhanh, giờ hành chính VN</p>
              <span className="channel-action">Mở Zalo →</span>
            </a>
            <a href="https://github.com/piwebagency/issues" target="_blank" rel="noreferrer" className="channel-card-v2">
              <div className="channel-icon">🐛</div>
              <h3>Bug tracker</h3>
              <p>Public GitHub issues, community-tracked</p>
              <span className="channel-action">GitHub Issues →</span>
            </a>
          </div>
        </section>

        <section className="contact-form-section">
          <div className="contact-form-grid">
            <div className="contact-form-side">
              <h2>Hoặc gửi message</h2>
              <p className="muted">
                Form này sẽ được gửi tới team Pi dựa vào chủ đề bạn chọn.
              </p>
              <ul className="contact-facts">
                <li>⏱ Trả lời trong 24h ngày làm việc</li>
                <li>🇻🇳 Team 100% Việt Nam</li>
                <li>🔒 Dữ liệu không share với third party</li>
                <li>💬 Support tiếng Việt + English</li>
              </ul>
            </div>

            <form onSubmit={onSubmit} className="contact-form-v2">
              <div className="form-row">
                <label>
                  <span>Tên của bạn</span>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nguyễn Văn A" />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
                </label>
              </div>
              <label>
                <span>Chủ đề</span>
                <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                  <option value="sales">🤝 Bán hàng / Bundle</option>
                  <option value="support">💬 Hỗ trợ kỹ thuật</option>
                  <option value="bug">🐛 Báo lỗi</option>
                  <option value="feature">💡 Đề xuất tính năng</option>
                  <option value="partnership">🤲 Hợp tác</option>
                  <option value="other">📮 Khác</option>
                </select>
              </label>
              <label>
                <span>Nội dung</span>
                <textarea rows={6} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Mô tả yêu cầu. Càng chi tiết càng dễ trả lời nhanh." />
              </label>
              <button type="submit" className="btn-contact" disabled={status === "sending"}>
                {status === "sending" ? "Đang gửi…" : "Gửi message ✉"}
              </button>
              {status === "ok" && <div className="contact-alert contact-alert--ok">✓ Đã gửi! Cảm ơn — chúng tôi sẽ phản hồi trong 24h.</div>}
              {status === "err" && <div className="contact-alert contact-alert--err">Gửi thất bại. Thử email trực tiếp nhé.</div>}
            </form>
          </div>
        </section>

        <section className="contact-office">
          <h2>🇻🇳 Về team Pi</h2>
          <div className="office-grid">
            <div>
              <h3>Pi Web Agency</h3>
              <p>Địa chỉ: TP. Hồ Chí Minh, Việt Nam</p>
            </div>
            <div>
              <h3>Giờ làm việc</h3>
              <p>Thứ 2 – Thứ 6: 9:00 – 18:00 (GMT+7)</p>
              <p>Thứ 7: 9:00 – 12:00 (Zalo)</p>
            </div>
            <div>
              <h3>Ngôn ngữ</h3>
              <p>Tiếng Việt (primary)</p>
              <p>English (secondary)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
