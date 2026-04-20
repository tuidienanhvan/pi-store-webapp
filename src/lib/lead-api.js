const API_URL = import.meta.env.VITE_LEAD_API_URL || "/api/lead";

export async function submitLead(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok || !json?.ok) {
    throw new Error(json?.message || `Request failed with status ${response.status}`);
  }

  return json;
}
