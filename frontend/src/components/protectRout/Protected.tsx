import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthCotext";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const {isAuthenticated} = useAuth();
//   const { user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
