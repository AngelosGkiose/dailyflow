import { Navigate } from "react-router";

import {
  useAuth,
} from "../../context/AuthContext.jsx";


function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}


export default PublicRoute;