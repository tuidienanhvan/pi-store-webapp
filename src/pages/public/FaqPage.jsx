const GROUPS = [
  {
    title: "General",
    items: [
      ["Pi Ecosystem khác Yoast / Rank Math như thế nào?", "Pi là suite 7 plugin thay vì chỉ SEO. Tính năng AI trả qua token (pay-as-you-go) thay vì subscription cứng. Giá trung bình 1/3 Rank Math Pro, tối ưu tiếng Việt."],
      ["Plugin có chạy độc lập không?", "Có. Free tier hoàn toàn local, không cần Pi account. Pro tier cần license + API connection tới Pi Backend."],
      ["Dữ liệu của tôi có gửi lên server Pi không?", "Chỉ khi dùng Pro features (AI). Metadata + content snippet của post gửi lên để generate. Không lưu vĩnh viễn — chỉ log để billing."],
    ],
  },
  {
    title: "Pricing & Billing",
    items: [
      ["1 token = bao nhiêu API call?", "Tùy nội dung. Ví dụ: AI SEO Bot ~500-1,000 tokens/call. Chatbot reply ~200-5,000 tokens. Lead scoring ~100-500. 100k tokens đủ cho 100-500 call trung bình."],
      ["Tokens có hết hạn không?", "Không. Ví Pi token persistent forever. Mua bao nhiêu xài bấy nhiêu."],
      ["Refund license?", "14 ngày đầu 100% refund. Sau đó không refund (nhưng tokens có thể transfer qua license khác)."],
      ["Thanh toán thế nào?", "Stripe (Visa/Mastercard/Amex). VN Pay + chuyển khoản VN sắp có."],
    ],
  },
  {
    title: "Technical",
    items: [
      ["Plugin cần PHP / WP version gì?", "PHP 8.3+, WordPress 6.0+. Tested on Local by Flywheel, SiteGround, Kinsta, Hostinger cPanel."],
      ["AI chạy trên server Pi hay server tôi?", "Trên Pi Backend. Plugin chỉ gửi HTTP request + license key. Không cần máy chủ mạnh."],
      ["Có hoạt động offline không?", "Free tier: 100%. Pro features cần internet để gọi Pi Backend."],
      ["Hỗ trợ multi-site?", "Free: 1 site. Pro: 1-3 sites tùy plugin. Agency: unlimited."],
      ["Uninstall có ảnh hưởng data?", "Meta + settings lưu ở wp_options + wp_postmeta. Deactivate không xóa. Uninstall (remove plugin) cũng giữ data. Có option 'delete all on uninstall' trong Settings."],
    ],
  },
  {
    title: "AI & Privacy",
    items: [
      ["AI dùng model nào?", "Pi router tự chọn. Ưu tiên: Groq Llama 70B → Gemini 2.0 Flash → Mistral Small → Cohere Command → Claude Sonnet (fallback paid) → GPT-4o (fallback paid)."],
      ["AI content có bản quyền gì không?", "Bạn sở hữu 100% output. Pi không claim copyright. Lưu ý: upstream providers có Terms riêng — đọc trước khi publish hàng loạt AI content."],
      ["Log AI calls có private không?", "Có. Chỉ bạn + Pi admin xem được. Chúng tôi không bán data."],
    ],
  },
  {
    title: "Migration",
    items: [
      ["Migrate từ Yoast / Rank Math?", "Pi SEO v2 có built-in importer cho 7 plugin: Yoast, Rank Math, AIOSEO, SEO Framework, SEO Press, Slim SEO, SureRank. Chạy qua Tools → Import."],
      ["v1 plugins còn xài được không?", "Có. plugins/pi-seo v1 vẫn hoạt động bình thường. v2 là rewrite, không force migrate. Chạy song song OK."],
      ["Sau khi migrate có rollback được?", "v1 data vẫn giữ nguyên. Deactivate v2 + reactivate v1. Không mất gì."],
    ],
  },
];

export function FaqPage() {
  return (
    <div className="doc-page">
      <h1>Câu hỏi thường gặp</h1>
      <p className="lead">Không tìm thấy câu trả lời? Email <a href="mailto:support@piwebagency.com">support@piwebagency.com</a>.</p>
      {GROUPS.map((g) => (
        <section key={g.title} style={{ marginTop: "2rem" }}>
          <h2>{g.title}</h2>
          {g.items.map(([q, a], i) => (
            <details key={i} className="faq-item">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
      ))}
    </div>
  );
}
