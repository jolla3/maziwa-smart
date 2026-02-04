import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const PrivateRoute = ({ children, role }) => {
  const { user, token } = useContext(AuthContext);

  // Auth still resolving
  if (token && !user) {
    return null; // or a spinner if you want
  }

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch
  if (role && user.role !== role) {
    return <Navigate  />;
  }

  return children;
};

export default PrivateRoute;
