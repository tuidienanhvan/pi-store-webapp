const REQUEST_TIMEOUT_MS = 8000;

function safeString(value, maxLength = 1000) {
  return String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function safeNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function parseBody(body) {
  if (typeof body === "string") {
    try {
      return JSON.parse(body || "{}");
    } catch {
      return {};
    }
  }
  return body ?? {};
}

export function sanitizeLeadPayload(input, sourceName) {
  const name = safeString(input?.name, 120);
  const email = safeString(input?.email, 160);
  const phone = safeString(input?.phone, 50);

  if (!name || !email || !phone) {
    return {
      ok: false,
      error: {
        status: 400,
        code: "INVALID_PAYLOAD",
        message: "Missing required fields: name, email, phone",
      },
    };
  }

  return {
    ok: true,
    payload: {
      source: sourceName,
      name,
      email,
      phone,
      website: safeString(input?.website, 240),
      productSlug: safeString(input?.productSlug, 120),
      productName: safeString(input?.productName, 160),
      productType: safeString(input?.productType, 40),
      billingCycle: safeString(input?.billingCycle, 20) || "monthly",
      pricingAmount: safeNumber(input?.pricingAmount),
      pricingCurrency: safeString(input?.pricingCurrency, 12) || "VND",
      message: safeString(input?.message, 2000),
      locale: safeString(input?.locale, 12) || "vi",
      sourcePage: safeString(input?.sourcePage, 240) || "/",
      timestamp: safeString(input?.timestamp, 80) || new Date().toISOString(),
    },
  };
}

async function forwardLead(webhookUrl, sharedSecret, payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-pi-shared-secret": sharedSecret,
      },
      signal: controller.signal,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: {
          status: 502,
          code: "UPSTREAM_FAILED",
          message: "Lead webhook rejected the request",
        },
      };
    }

    return { ok: true };
  } catch (error) {
    if (error?.name === "AbortError") {
      return {
        ok: false,
        error: {
          status: 504,
          code: "UPSTREAM_TIMEOUT",
          message: "Lead webhook timed out",
        },
      };
    }

    return {
      ok: false,
      error: {
        status: 500,
        code: "NETWORK_ERROR",
        message: "Unable to forward lead request",
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Vercel Serverless Function
 * Receives lead payload from frontend and forwards to n8n webhook.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, code: "METHOD_NOT_ALLOWED", message: "Method not allowed" });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  const sharedSecret = process.env.N8N_SHARED_SECRET;
  const sourceName = process.env.LEAD_SOURCE_NAME || "pi-storefront";

  if (!webhookUrl || !sharedSecret) {
    return res.status(500).json({ ok: false, code: "CONFIG_MISSING", message: "Lead proxy is not configured" });
  }

  const body = parseBody(req.body);
  const sanitized = sanitizeLeadPayload(body, sourceName);

  if (!sanitized.ok) {
    return res.status(sanitized.error.status).json({
      ok: false,
      code: sanitized.error.code,
      message: sanitized.error.message,
    });
  }

  const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const payload = {
    leadId,
    ...sanitized.payload,
    receivedAt: new Date().toISOString(),
  };

  const upstream = await forwardLead(webhookUrl, sharedSecret, payload);
  if (!upstream.ok) {
    return res.status(upstream.error.status).json({
      ok: false,
      code: upstream.error.code,
      message: upstream.error.message,
    });
  }

  return res.status(200).json({ ok: true, leadId });
}
