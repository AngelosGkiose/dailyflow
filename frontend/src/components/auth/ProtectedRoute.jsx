import { Navigate } from "react-router";

import { getAccessToken } from "../../api/apiClient.js";

function ProtectedRoute({ children }) {
  const accessToken = getAccessToken();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;