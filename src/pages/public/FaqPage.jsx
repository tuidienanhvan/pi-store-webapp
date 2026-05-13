const GROUPS = [
  {
    title: "General",
    items: [
      ["Pi Ecosystem khc Yoast / Rank Math nhu th? no?", "Pi l suite plugin Pro cho WordPress, hi?n cung c?p SEO, Chatbot, Leads, Analytics, Performance, AI Cloud. Tnh nang AI tr? qua token (pay-as-you-go) thay v subscription c?ng. Gi trung bnh 1/3 Rank Math Pro, ti uu ti?ng Vi?t."],
      ["Plugin c ch?y d?c l?p khng?", "C. Free tier hon ton local, khng c?n Pi account. Pro tier c?n license + API connection ti Pi Backend."],
      ["D liu c?a ti c g?i ln server Pi khng?", "Ch? khi dng Pro features (AI). Metadata + content snippet c?a post g?i ln d? generate. Khng luu vinh vi?n  ch? log d? billing."],
    ],
  },
  {
    title: "Pricing & Billing",
    items: [
      ["1 token = bao nhiu API call?", "Ty n?i dung. V d?: AI SEO Bot ~500-1,000 tokens/call. Chatbot reply ~200-5,000 tokens. Lead scoring ~100-500. 100k tokens d? cho 100-500 call trung bnh."],
      ["Tokens c h?t h?n khng?", "Khng. V Pi token persistent forever. Mua bao nhiu xi b?y nhiu."],
      ["Refund license?", "14 ngy d?u 100% refund. Sau d khng refund (nhung tokens c th? transfer qua license khc)."],
      ["Thanh ton th? no?", "Stripe (Visa/Mastercard/Amex). VN Pay + chuy?n kho?n VN s?p c."],
    ],
  },
  {
    title: "Technical",
    items: [
      ["Plugin c?n PHP / WP version g?", "PHP 8.3+, WordPress 6.0+. Tested on Local by Flywheel, SiteGround, Kinsta, Hostinger cPanel."],
      ["AI ch?y trn server Pi hay server ti?", "Trn Pi Backend. Plugin ch? g?i HTTP request + license key. Khng c?n my ch? m?nh."],
      ["C ho?t d?ng offline khng?", "Free tier: 100%. Pro features c?n internet d? g?i Pi Backend."],
  ["H? tr? multi-site?", "Free: 1 site. Pro: 1-3 sites ty plugin. Max: unlimited."],
      ["Uninstall c ?nh hu?ng data?", "Meta + settings luu ? wp_options + wp_postmeta. Deactivate khng xa. Uninstall (remove plugin) cung gi? data. C option 'delete all on uninstall' trong Settings."],
    ],
  },
  {
    title: "AI & Privacy",
    items: [
      ["AI dng model no?", "Pi router t? ch?n. Uu tin: Groq Llama 70B ? Gemini 2.0 Flash ? Mistral Small ? Cohere Command ? Claude Sonnet (fallback paid) ? GPT-4o (fallback paid)."],
      ["AI content c b?n quy?n g khng?", "B?n s? h?u 100% output. Pi khng claim copyright. Luu : upstream providers c Terms ring  d?c tru?c khi publish hng lo?t AI content."],
      ["Log AI calls c private khng?", "C. Ch? b?n + Pi admin xem du?c. Chng ti khng bn data."],
    ],
  },
  {
    title: "Migration",
    items: [
      ["Migrate t? Yoast / Rank Math?", "Pi SEO v2 c built-in importer cho 7 plugin: Yoast, Rank Math, AIOSEO, SEO Framework, SEO Press, Slim SEO, SureRank. Ch?y qua Tools ? Import."],
      ["v1 plugins cn xi du?c khng?", "C. plugins/pi-seo v1 v?n ho?t d?ng bnh thu?ng. v2 l rewrite, khng force migrate. Ch?y song song OK."],
      ["Sau khi migrate c rollback du?c?", "v1 data v?n gi? nguyn. Deactivate v2 + reactivate v1. Khng m?t g."],
    ],
  },
];

export function FaqPage() {
  return (
    <div className="doc-page">
      <h1>Cu h?i thu?ng g?p</h1>
      <p className="lead">Khng tm th?y cu tr? l?i? Email <a href="mailto:support@piwebagency.com">support@piwebagency.com</a>.</p>
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

export default FaqPage;
