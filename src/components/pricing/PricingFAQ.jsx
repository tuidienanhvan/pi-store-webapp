import React from "react";
import { Card } from "../ui";

export function PricingFAQ() {
  return (
    <section className="container" style={{ paddingTop: "var(--s-16)", paddingBottom: "var(--s-16)", borderTop: "1px solid var(--hairline)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ margin: "0 0 var(--s-5)", fontSize: "var(--fs-30)", textAlign: "center" }}>Câu hỏi thường gặp</h2>

        <div className="stack" style={{ gap: "var(--s-3)" }}>
          <FaqItem q="Pi AI Cloud tokens là gì?">
            Đơn vị tính cước cho mỗi AI call. Pi route tự động qua 25 provider (Groq, Gemini, OpenAI, Claude…).
            Khách không cần chọn provider — chỉ chọn mức chất lượng (fast / balanced / best).
          </FaqItem>
          <FaqItem q="Hết token giữa tháng thì sao?">
            System chặn API call khi đạt quota (trả 402). Bạn có thể upgrade gói ngay — quota mới kích hoạt tức thì,
            phần chênh lệch tính theo prorated.
          </FaqItem>
          <FaqItem q="Gói Yearly tiết kiệm bao nhiêu?">
            Yearly = 10 tháng (tiết kiệm ~17% so với trả tháng). Ví dụ Pro: $29/tháng → $290/năm thay vì $348.
          </FaqItem>
          <FaqItem q="Có thể huỷ bất cứ lúc nào không?">
            Có. Huỷ → giữ quyền dùng đến hết chu kỳ đã thanh toán. Không auto-refund phần chưa dùng.
          </FaqItem>
          <FaqItem q="Free tier / dùng thử?">
            Hiện tại không có free tier. Đăng ký dùng thử 14 ngày Starter với code <code>TRIAL14</code>.
          </FaqItem>
          <FaqItem q="Plugin WordPress có miễn phí không?">
            Plugin v2 chia Free / Pro. Free tier bản không AI, tải ai cũng được. Pro unlock AI feature qua Pi Cloud tokens.
          </FaqItem>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, children }) {
  return (
    <details className="faq-item">
      <summary>{q}</summary>
      <p>{children}</p>
    </details>
  );
}
