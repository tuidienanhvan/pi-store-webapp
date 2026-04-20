export function AboutPage() {
  return (
    <div className="doc-page">
      <h1>Về Pi Ecosystem</h1>
      <p className="lead">
        Pi Ecosystem là bộ plugin WordPress thế hệ thứ 2 — tách sạch giữa <strong>Free tier</strong> (đủ xài cho 80% use case) và <strong>Pro tier</strong> (AI-powered, trả qua token).
      </p>

      <h2>Triết lý</h2>
      <ul>
        <li><strong>Logic valuable ở server</strong> — AI prompts, scoring algorithms, schema library không ship lên client.</li>
        <li><strong>Token kinh tế</strong> — 1 ví tokens dùng chung mọi plugin, thay vì subscription riêng từng plugin.</li>
        <li><strong>25 AI providers</strong> — router tự chọn provider rẻ nhất (Groq free → Gemini free → Claude paid fallback). Khách hàng trả 1 giá cố định qua token, Pi giữ margin.</li>
        <li><strong>Vietnamese-first</strong> — prompts huấn luyện cho tiếng Việt, support Zalo trực tiếp, UX đơn giản cho SME Việt.</li>
      </ul>

      <h2>Team</h2>
      <p>
        Pi Ecosystem được phát triển bởi đội ngũ developer + SEO specialist tại Việt Nam. Mục tiêu: mang chất lượng Rank Math Pro / Yoast Premium với giá 1/3 + tối ưu riêng cho thị trường nội địa.
      </p>

      <h2>Lộ trình</h2>
      <ul>
        <li>✅ Q2 2026: Pi SEO v2 + Pi AI Cloud launch</li>
        <li>🚧 Q3 2026: Pi Chatbot v2 + Pi Leads v2 full</li>
        <li>🔜 Q4 2026: Pi Analytics + Performance v2</li>
        <li>🔜 Q1 2027: Pi Dashboard Pro + white-label</li>
      </ul>

      <h2>Liên hệ</h2>
      <ul>
        <li>Email: <a href="mailto:hello@piwebagency.com">hello@piwebagency.com</a></li>
        <li>Zalo: <a href="https://zalo.me/pi-ecosystem">pi-ecosystem</a></li>
        <li>GitHub: <a href="https://github.com/piwebagency">github.com/piwebagency</a></li>
      </ul>
    </div>
  );
}
