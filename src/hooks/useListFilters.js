import { useCallback, useEffect, useRef, useState } from "react";

import { useSearchParams } from "react-router-dom";



/**

 * Hook: sync table filter/sort/pagination state to URL query params.

 *

 * Usage:

 *   const { filters, setFilter, setFilters, reset } = useListFilters({

 *     q: "", status: "", limit: 50, offset: 0,

 *   });

 *   // filters is always { q, status, limit, offset, ... }

 *   // setFilter("status", "active")  ? pushes ?status=active to URL

 *   // setFilters({ q: "foo", offset: 0 })  ? batch update

 *   // reset()  ? clears all to defaults

 *

 * Empty-string / null values are removed from URL (clean URLs).

 */

export function useListFilters(defaults = {}) {

  const [sp, setSp] = useSearchParams();



  const filters = { ...defaults };

  for (const [k, v] of sp.entries()) {

    // Numeric coercion for limit/offset/page etc. (stay as number if default was number)

    if (typeof defaults[k] === "number" && v !== "") {

      const num = Number(v);

      filters[k] = Number.isFinite(num) ? num : defaults[k];

    } else {

      filters[k] = v;

    }

  }



  const setFilters = useCallback((patch) => {

    setSp((prev) => {

      const next = new URLSearchParams(prev);

      for (const [k, v] of Object.entries(patch)) {

        if (v === "" || v == null || v === defaults[k]) {

          next.delete(k);

        } else {

          next.set(k, String(v));

        }

      }

      return next;

    }, { replace: true });

  }, [setSp, defaults]);



  const setFilter = useCallback((key, value) => {

    setFilters({ [key]: value });

  }, [setFilters]);



  const reset = useCallback(() => {

    setSp(new URLSearchParams(), { replace: true });

  }, [setSp]);



  const hasActive = Object.keys(filters).some((k) => {

    if (k === "limit" || k === "offset") return false;

    return filters[k] !== defaults[k] && filters[k] !== "" && filters[k] != null;

  });



  return { filters, setFilter, setFilters, reset, hasActive };

}



/**

 * Debounce a callback. Returns a stable function that defers invocation

 * until `delay` ms have passed without a new call.

 */

export function useDebouncedCallback(fn, delay = 300) {

  const ref = useRef(fn);

  const timer = useRef(null);

  useEffect(() => { ref.current = fn; }, [fn]);

  return useCallback((...args) => {

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => ref.current(...args), delay);

  }, [delay]);

}



/**

 * Debounce a primitive value. Returns the value after `delay` ms of stability.

 */

export function useDebouncedValue(value, delay = 300) {

  const [debounced, setDebounced] = useState(value);

  useEffect(() => {

    const id = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(id);

  }, [value, delay]);

  return debounced;

}

