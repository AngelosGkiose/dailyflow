import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AUTH_CHANGED_EVENT,
  getAccessToken,
  removeAccessToken,
  saveAccessToken,
} from "../api/apiClient.js";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] =
    useState(() => Boolean(getAccessToken()));

  useEffect(() => {
    function synchronizeAuthentication() {
      setIsAuthenticated(
        Boolean(getAccessToken())
      );
    }

    window.addEventListener(
      AUTH_CHANGED_EVENT,
      synchronizeAuthentication
    );

    window.addEventListener(
      "storage",
      synchronizeAuthentication
    );

    return () => {
      window.removeEventListener(
        AUTH_CHANGED_EVENT,
        synchronizeAuthentication
      );

      window.removeEventListener(
        "storage",
        synchronizeAuthentication
      );
    };
  }, []);


  function login(accessToken) {
    saveAccessToken(accessToken);

    setIsAuthenticated(true);
  }


  function logout() {
    removeAccessToken();

    setIsAuthenticated(false);
  }


  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
    }),
    [isAuthenticated]
  );


  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}