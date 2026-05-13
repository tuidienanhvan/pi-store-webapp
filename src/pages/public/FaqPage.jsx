const GROUPS = [
  {
    title: "Chung",
    items: [
      ["Pi Ecosystem khác Yoast / Rank Math như thế nào?", "Pi là bộ suite plugin Pro cho WordPress, hiện cung cấp SEO, Chatbot, Leads, Analytics, Performance, AI Cloud. Tính năng AI trả qua token (pay-as-you-go) thay vì subscription cứng. Giá trung bình chỉ bằng 1/3 Rank Math Pro và được tối ưu riêng cho tiếng Việt."],
      ["Plugin có chạy độc lập không?", "Có. Gói Free hoàn toàn chạy local, không cần tài khoản Pi. Gói Pro cần có license và kết nối API tới Pi Backend."],
      ["Dữ liệu của tôi có gửi lên server Pi không?", "Chỉ khi dùng các tính năng Pro (AI). Metadata và nội dung snippet của bài viết sẽ được gửi lên để xử lý. Chúng tôi không lưu trữ vĩnh viễn, chỉ log để tính phí (billing)."],
    ],
  },
  {
    title: "Giá cả & Thanh toán",
    items: [
      ["1 token = bao nhiêu API call?", "Tùy nội dung. Ví dụ: AI SEO Bot ~500-1,000 tokens/call. Chatbot trả lời ~200-5,000 tokens. Lead scoring ~100-500. 100k tokens đủ cho khoảng 100-500 lần gọi trung bình."],
      ["Tokens có hết hạn không?", "Không. Vì Pi token là vĩnh viễn. Mua bao nhiêu dùng bấy nhiêu."],
      ["Chính sách hoàn tiền license?", "Trong 14 ngày đầu sẽ được hoàn tiền 100%. Sau đó không hỗ trợ hoàn tiền (nhưng tokens có thể chuyển sang license khác)."],
      ["Thanh toán như thế nào?", "Hỗ trợ Stripe (Visa/Mastercard/Amex). VN Pay và chuyển khoản ngân hàng Việt Nam đang được cập nhật."],
    ],
  },
  {
    title: "Kỹ thuật",
    items: [
      ["Plugin cần phiên bản PHP / WP nào?", "PHP 8.3+, WordPress 6.0+. Đã test tốt trên Local by Flywheel, SiteGround, Kinsta, Hostinger cPanel."],
      ["AI chạy trên server Pi hay server của tôi?", "Chạy trên Pi Backend. Plugin chỉ gửi request HTTP kèm license key. Không cần máy chủ cấu hình mạnh."],
      ["Có hoạt động offline không?", "Gói Free: 100%. Các tính năng Pro cần có internet để gọi tới Pi Backend."],
      ["Hỗ trợ multi-site?", "Free: 1 site. Pro: 1-3 sites tùy loại plugin. Max: không giới hạn."],
      ["Uninstall có ảnh hưởng dữ liệu?", "Meta và cài đặt lưu ở wp_options và wp_postmeta. Deactivate không xóa. Uninstall (remove plugin) cũng giữ lại dữ liệu. Có tùy chọn 'Xóa sạch khi gỡ' trong phần Cài đặt."],
    ],
  },
  {
    title: "AI & Quyền riêng tư",
    items: [
      ["AI dùng model nào?", "Pi router tự chọn model tối ưu nhất. Ưu tiên: Groq Llama 70B > Gemini 2.0 Flash > Mistral Small > Cohere Command > Claude Sonnet (fallback) > GPT-4o (fallback)."],
      ["AI content có bản quyền không?", "Bạn sở hữu 100% nội dung tạo ra. Pi không yêu cầu bản quyền. Lưu ý: các nhà cung cấp AI gốc có điều khoản riêng, bạn nên đọc kỹ trước khi xuất bản hàng loạt."],
      ["Log AI call có riêng tư không?", "Có. Chỉ bạn và quản trị viên Pi mới xem được. Chúng tôi cam kết không bán dữ liệu người dùng."],
    ],
  },
  {
    title: "Di trú dữ liệu",
    items: [
      ["Migrate từ Yoast / Rank Math?", "Pi SEO v2 có bộ công cụ nhập (importer) cho 7 plugin: Yoast, Rank Math, AIOSEO, SEO Framework, SEO Press, Slim SEO, SureRank. Chạy qua menu Công cụ > Nhập dữ liệu."],
      ["Các plugin v1 còn dùng được không?", "Có. Các bản v1 vẫn hoạt động bình thường. v2 là bản viết lại hoàn toàn, không bắt buộc nâng cấp. Có thể chạy song song."],
      ["Sau khi migrate có quay lại được không?", "Dữ liệu v1 vẫn được giữ nguyên. Bạn chỉ cần tắt v2 và bật lại v1. Không mất dữ liệu."],
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

export function PricingFaq() {
  return (
    <div className="pricing-faq">
      {GROUPS.find(g => g.title === "Giá cả & Thanh toán").items.map(([q, a], i) => (
        <details key={i} className="faq-item">
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}

export default FaqPage;
