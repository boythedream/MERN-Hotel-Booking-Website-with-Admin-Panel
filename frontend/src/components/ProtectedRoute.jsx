import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "./Loader.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader label="Checking session" />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export default ProtectedRoute;
