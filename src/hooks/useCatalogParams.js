import { startTransition, useDeferredValue, useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";



function normalizeFilterType(value) {

  if (value === "tokens" || value === "bundle" || value === "plugin") return value;

  // Backward compatibility: old links may still use `theme`.

  if (value === "theme") return "plugin";

  return "all";

}



function normalizeBillingCycle(value) {

  return value === "yearly" ? "yearly" : "monthly";

}



export function useCatalogParams() {

  const [searchParams, setSearchParams] = useSearchParams();

  const filterType = normalizeFilterType(searchParams.get("type"));

  const billingCycle = normalizeBillingCycle(searchParams.get("billing"));

  const queryFromUrl = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(queryFromUrl);

  const deferredQuery = useDeferredValue(query);



  useEffect(() => {

     

    setQuery(queryFromUrl);

  }, [queryFromUrl]);



  useEffect(() => {

    if (deferredQuery === queryFromUrl) return;



    startTransition(() => {

      const nextParams = new URLSearchParams(searchParams);

      if (deferredQuery.trim()) {

        nextParams.set("q", deferredQuery.trim());

      } else {

        nextParams.delete("q");

      }

      setSearchParams(nextParams, { replace: true });

    });

  }, [deferredQuery, queryFromUrl, searchParams, setSearchParams]);



  const updateParam = (key, value, defaultValue) => {

    startTransition(() => {

      const nextParams = new URLSearchParams(searchParams);

      if (!value || value === defaultValue) {

        nextParams.delete(key);

      } else {

        nextParams.set(key, value);

      }

      setSearchParams(nextParams, { replace: false });

    });

  };



  return {

    filterType,

    setFilterType: (nextFilterType) => updateParam("type", normalizeFilterType(nextFilterType), "all"),

    billingCycle,

    setBillingCycle: (nextBillingCycle) => updateParam("billing", normalizeBillingCycle(nextBillingCycle), "monthly"),

    query,

    deferredQuery,

    setQuery,

    search: searchParams.toString() ? `?${searchParams.toString()}` : "",

  };

}

