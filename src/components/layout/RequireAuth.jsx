import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function RequireAuth({ admin = false, children }) {
  const { isAuthed, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--pi-text-2, #6b7280)" }}>
        Đang kiểm tra phiên đăng nhập…
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (admin && !isAdmin) {
    return <Navigate to="/app" replace />;
  }

  return children;
}
