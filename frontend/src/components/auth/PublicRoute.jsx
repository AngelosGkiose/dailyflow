import {
  Navigate,
} from "react-router";

import {
  useAuth,
} from "../../context/AuthContext.jsx";


function PublicRoute({
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