import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";





export function RequireAuth({ admin = false, children, fallback }) {

  const { isAuthed, isAdmin, loading } = useAuth();

  const location = useLocation();



  if (loading) {

    return fallback || null;

  }



  if (!isAuthed) {

    return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  }



  if (admin && !isAdmin) {

    return <Navigate to="/app" replace />;

  }



  return children;

}

// 

