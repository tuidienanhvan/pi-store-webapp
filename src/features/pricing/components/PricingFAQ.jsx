import React from "react";
import './PricingFAQ.css';

export function PricingFAQ() {
  return (
    <section className="pricing-faq">
      <div className="pricing-faq__container">
        <h2 className="pricing-faq__title">Cu h?i thu?ng g?p</h2>

        <div className="stack">
          <FaqItem q="Pi AI Cloud tokens l g?">
            on v? tnh cu?c cho mi AI call. Pi route t? d?ng qua 25 provider (Groq, Gemini, OpenAI, Claude).
            Khch khng c?n ch?n provider  ch? ch?n m?c ch?t lu?ng (fast / balanced / best).
          </FaqItem>
          <FaqItem q="H?t token gi?a thng th sao?">
            System ch?n API call khi d?t quota (tr? 402). B?n c th? upgrade gi ngay  quota mi kch ho?t t?c th,
            ph?n chnh l?ch tnh theo prorated.
          </FaqItem>
          <FaqItem q="Gi Yearly ti?t ki?m bao nhiu?">
            Yearly = 10 thng (ti?t ki?m ~17% so v?i tr? thng). V d? Pro: $29/thng ? $290/nam thay v $348.
          </FaqItem>
          <FaqItem q="C th? hu? b?t c? lc no khng?">
            C. Hu? ? gi? quy?n dng d?n h?t chu k? d thanh ton. Khng auto-refund ph?n chua dng.
          </FaqItem>
          <FaqItem q="Free tier / dng th??">
            Hi?n ti khng c free tier. ang k dng th? 14 ngy Starter v?i code <code>TRIAL14</code>.
          </FaqItem>
          <FaqItem q="Plugin WordPress c mi?n ph khng?">
            Plugin v2 chia Free / Pro. Free tier b?n khng AI, ti ai cung du?c. Pro unlock AI feature qua Pi Cloud tokens.
          </FaqItem>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, children }) {
  return (
    <details className="faq-item">
      <summary>
        {q}
        <svg className="shrink-0 transition-transform duration-200" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <p>{children}</p>
    </details>
  );
}
