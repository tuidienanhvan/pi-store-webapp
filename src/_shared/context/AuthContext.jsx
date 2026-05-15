import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { api, PiApiError } from "../api/api-client";



const AuthContext = createContext(null);



// Mock mode  set VITE_MOCK_AUTH=1 in .env to bypass backend for UI preview.

// Any login credentials work; email "admin@..." automatically becomes admin.

const MOCK_MODE = import.meta.env.VITE_MOCK_AUTH === "1" || import.meta.env.VITE_MOCK_AUTH === "true";



function mockUser(email = "admin@piwebagency.com", is_admin = true) {

  return {

    id: 1,

    email,

    name: is_admin ? "Pi Admin (mock)" : "Pi User (mock)",

    is_admin,

    is_verified: true,

    created_at: new Date().toISOString(),

    license_count: 3,

    token_balance: 87500,

  };

}



export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);



  // Hydrate on mount from stored JWT

  useEffect(() => {

    const jwt = localStorage.getItem("pi_jwt");

    if (!jwt) {

     

      setLoading(false);

      return;

    }



    // Mock mode: don't call backend, reconstruct user from localStorage

    if (MOCK_MODE) {

      const email = localStorage.getItem("pi_mock_email") || "admin@piwebagency.com";

      const isAdmin = localStorage.getItem("pi_admin") === "1";

      setUser(mockUser(email, isAdmin));

      setLoading(false);

      return;

    }



    api.auth

      .me()

      .then((data) => setUser(data))

      .catch(() => {

        localStorage.removeItem("pi_jwt");

        localStorage.removeItem("pi_admin");

      })

      .finally(() => setLoading(false));

  }, []);



  const login = useCallback(async (email, password) => {

    if (MOCK_MODE) {

      // Accept any password; admin if email starts with "admin"

      const isAdmin = /^admin/i.test(email);

      const u = mockUser(email, isAdmin);

      localStorage.setItem("pi_jwt", "mock-jwt-" + Date.now());

      localStorage.setItem("pi_mock_email", email);

      if (isAdmin) localStorage.setItem("pi_admin", "1");

      else localStorage.removeItem("pi_admin");

      setUser(u);

      return { token: "mock", expires_in: 86400, user: u };

    }



    const res = await api.auth.login(email, password);

    if (res?.token) {

      localStorage.setItem("pi_jwt", res.token);

      if (res.user?.is_admin) localStorage.setItem("pi_admin", "1");

      setUser(res.user);

    }

    return res;

  }, []);



  const signup = useCallback(async (payload) => {

    if (MOCK_MODE) {

      const u = mockUser(payload.email, false);

      localStorage.setItem("pi_jwt", "mock-jwt-" + Date.now());

      localStorage.setItem("pi_mock_email", payload.email);

      setUser(u);

      return { token: "mock", expires_in: 86400, user: u };

    }



    const res = await api.auth.signup(payload);

    if (res?.token) {

      localStorage.setItem("pi_jwt", res.token);

      setUser(res.user);

    }

    return res;

  }, []);



  const logout = useCallback(() => {

    if (MOCK_MODE) {

      localStorage.removeItem("pi_jwt");

      localStorage.removeItem("pi_admin");

      localStorage.removeItem("pi_mock_email");

    } else {

      api.auth.logout();

    }

    setUser(null);

  }, []);



  const setLicenseKey = useCallback((key) => {

    if (key) localStorage.setItem("pi_license_key", key);

    else localStorage.removeItem("pi_license_key");

  }, []);



  const value = {

    user,

    loading,

    isAuthed: !!user,

    isAdmin: user?.is_admin === true,

    mockMode: MOCK_MODE,

    login,

    signup,

    logout,

    setLicenseKey,

  };



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}



    // eslint-disable-next-line react-refresh/only-export-components

export function useAuth() {

  const ctx = useContext(AuthContext);

  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");

  return ctx;

}



export { PiApiError };

