import test from "node:test";
import assert from "node:assert/strict";
import handler, { sanitizeLeadPayload } from "../api/lead.js";

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

test("sanitizeLeadPayload trims fields and keeps contract", () => {
  const result = sanitizeLeadPayload(
    {
      name: "  Nguyen Van A  ",
      email: "  a@example.com ",
      phone: " 0123456789 ",
      website: " https://example.com ",
      productSlug: "pi-seo",
      productName: "Pi SEO",
      productType: "plugin",
      billingCycle: "yearly",
      pricingAmount: 2392000,
      pricingCurrency: "VND",
      message: " Need demo ",
      locale: "vi",
      sourcePage: "/product/pi-seo",
      timestamp: "2026-04-14T00:00:00.000Z",
    },
    "pi-storefront",
  );

  assert.equal(result.ok, true);
  assert.equal(result.payload.name, "Nguyen Van A");
  assert.equal(result.payload.productType, "plugin");
  assert.equal(result.payload.pricingAmount, 2392000);
});

test("lead handler rejects invalid payload", async () => {
  process.env.N8N_WEBHOOK_URL = "https://example.com/webhook";
  process.env.N8N_SHARED_SECRET = "secret";
  process.env.LEAD_SOURCE_NAME = "pi-storefront";

  const req = {
    method: "POST",
    body: { name: "", email: "", phone: "" },
  };
  const res = createResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.ok, false);
  assert.equal(res.body.code, "INVALID_PAYLOAD");
});

test("lead handler forwards sanitized payload and returns lead id", async () => {
  process.env.N8N_WEBHOOK_URL = "https://example.com/webhook";
  process.env.N8N_SHARED_SECRET = "secret";
  process.env.LEAD_SOURCE_NAME = "pi-storefront";

  const calls = [];
  global.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
    };
  };

  const req = {
    method: "POST",
    body: {
      name: "Nguyen Van B",
      email: "b@example.com",
      phone: "0987654321",
      productSlug: "pi-chatbot",
      productName: "Pi Chatbot",
      productType: "plugin",
      billingCycle: "monthly",
      pricingAmount: 279000,
      pricingCurrency: "VND",
      message: "Need a demo",
      locale: "en",
      sourcePage: "/product/pi-chatbot",
      timestamp: "2026-04-14T00:00:00.000Z",
    },
  };
  const res = createResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
  assert.equal(typeof res.body.leadId, "string");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://example.com/webhook");

  const forwarded = JSON.parse(calls[0].options.body);
  assert.equal(forwarded.productSlug, "pi-chatbot");
  assert.equal(forwarded.pricingAmount, 279000);
  assert.equal(forwarded.source, "pi-storefront");
});
