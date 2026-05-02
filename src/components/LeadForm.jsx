import { useEffect, useMemo, useState } from "react";
import { useLocale } from "../context/LocaleContext";
import { getLocalizedProduct } from "../lib/catalog";
import { submitLead } from "../lib/lead-api";
import "./LeadForm.css";

function getProductName(product, locale) {
  return product?.copy?.[locale]?.name ?? product?.copy?.vi?.name ?? product?.slug ?? "";
}

export function LeadForm({
  defaultProduct = null,
  products = [],
  sourcePage = "/",
  billingCycle = "monthly",
  lockedProduct = false,
}) {
  const { dict, locale } = useLocale();

  const options = useMemo(() => {
    return products.map((product) => ({
      slug: product.slug,
      name: getProductName(product, locale),
    }));
  }, [products, locale]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    productSlug: defaultProduct?.slug ?? options[0]?.slug ?? "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!defaultProduct) return;
    setForm((prev) => ({ ...prev, productSlug: defaultProduct.slug }));
  }, [defaultProduct]);

  useEffect(() => {
    if (form.productSlug) return;
    if (!options[0]?.slug) return;
    setForm((prev) => ({ ...prev, productSlug: options[0].slug }));
  }, [options, form.productSlug]);

  const activeProduct = useMemo(() => {
    return products.find((product) => product.slug === form.productSlug) ?? defaultProduct ?? null;
  }, [products, form.productSlug, defaultProduct]);

  const activeProductLocalized = useMemo(() => {
    if (!activeProduct) return null;
    return getLocalizedProduct(activeProduct, locale, billingCycle);
  }, [activeProduct, locale, billingCycle]);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError(dict.lead.required);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        website: form.website.trim(),
        productSlug: activeProduct?.slug ?? "",
        productName: getProductName(activeProduct, locale),
        productType: activeProduct?.type ?? "",
        billingCycle,
        pricingAmount: activeProductLocalized?.localizedPricing?.amount ?? null,
        pricingCurrency: activeProductLocalized?.localizedPricing?.currency ?? "VND",
        message: form.message.trim(),
        locale,
        sourcePage,
        timestamp: new Date().toISOString(),
      };

      await submitLead(payload);
      setSuccess(dict.lead.success);
      setForm((prev) => ({
        ...prev,
        name: "",
        email: "",
        phone: "",
        website: "",
        message: "",
      }));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : dict.lead.errorFallback);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="lead-box" id="lead-form">
      <div className="lead-box__intro">
        <p className="lead-box__eyebrow">{dict.lead.eyebrow}</p>
        <h2>{dict.lead.title}</h2>
        <p>{dict.lead.description}</p>
      </div>

      <form className="lead-form" onSubmit={onSubmit} noValidate>
        <div className="lead-form__grid">
          <label>
            {dict.lead.name}
            <input
              type="text"
              value={form.name}
              onChange={(event) => onChange("name", event.target.value)}
              required
            />
          </label>

          <label>
            {dict.lead.email}
            <input
              type="email"
              value={form.email}
              onChange={(event) => onChange("email", event.target.value)}
              required
            />
          </label>

          <label>
            {dict.lead.phone}
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => onChange("phone", event.target.value)}
              required
            />
          </label>

          <label>
            {dict.lead.website}
            <input type="url" value={form.website} onChange={(event) => onChange("website", event.target.value)} />
          </label>
        </div>

        {lockedProduct && activeProductLocalized ? (
          <div className="lead-form__summary">
            <span>{dict.lead.productLocked}</span>
            <strong>{activeProductLocalized.localizedName}</strong>
            <small>
              {activeProductLocalized.localizedPricing.label}
              {activeProductLocalized.localizedPricing.billing
                ? ` ${activeProductLocalized.localizedPricing.billing}`
                : ""}
            </small>
            <input type="hidden" name="productSlug" value={form.productSlug} />
          </div>
        ) : (
          <label>
            {dict.lead.product}
            <select value={form.productSlug} onChange={(event) => onChange("productSlug", event.target.value)}>
              {options.map((option) => (
                <option value={option.slug} key={option.slug}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          {dict.lead.message}
          <textarea
            rows={5}
            value={form.message}
            onChange={(event) => onChange("message", event.target.value)}
            placeholder={dict.lead.note}
          />
        </label>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? dict.lead.submitting : dict.lead.submit}
        </button>
      </form>

      {success ? <p className="form-status success">{success}</p> : null}
      {error ? <p className="form-status error">{error}</p> : null}
    </section>
  );
}
