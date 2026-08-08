import {
  Navigate,
} from "react-router";

import {
  useAuth,
} from "../../context/AuthContext.jsx";


function ProtectedRoute({
  children,
}) {
  const {
    isAuthenticated,
    authLoading,
  } = useAuth();


  if (authLoading) {
    return (
      <div>
        Checking session...
      </div>
    );
  }


  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  return children;
}


export default ProtectedRoute;