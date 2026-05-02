import { api } from "../lib/api-client";

export const billing = {
  subscribeCheckout: ({ tier, success_url, cancel_url }) =>
    api.billing.subscribeCheckout({
      tier,
      success_url: success_url || `${window.location.origin}/app/billing?status=success`,
      cancel_url: cancel_url || `${window.location.origin}/pricing?status=canceled`,
    }),
  changeTier: (new_tier) => api.billing.changeTier(new_tier),
  cancel: () => api.billing.cancel(),
  status: () => api.billing.status(),
};

export default billing;
