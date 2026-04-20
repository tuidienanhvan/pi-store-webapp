import React from "react";
import { Input } from "../ui";

export function DocsHero() {
  return (
    <header className="container stack" style={{ gap: "var(--s-4)", paddingTop: "var(--s-16)", maxWidth: 600 }}>
      <h1 className="text-48 m-0">📚 Pi Documentation</h1>
      <p className="text-18 muted m-0">Tài liệu Pi Ecosystem — cài đặt, sử dụng, API, và hỗ trợ kỹ thuật.</p>
      <div className="stack" style={{ gap: "var(--s-2)", marginTop: "var(--s-4)" }}>
        <Input type="search" placeholder="Search docs… (Ctrl+K)" disabled />
        <span className="text-12 muted">Đang xây dựng — tạm thời duyệt theo các chuyên mục bên dưới.</span>
      </div>
    </header>
  );
}
