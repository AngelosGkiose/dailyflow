import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from "../api/authApi.js";


const AuthContext =
  createContext(null);


export function AuthProvider({
  children,
}) {
  const [
    user,
    setUser,
  ] = useState(null);

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);


  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const currentUser =
          await getCurrentUser();

        setUser(
          currentUser
        );
      } catch (requestError) {
        if (
          requestError?.status ===
          401
        ) {
          setUser(null);
        } else {
          setUser(null);
        }
      } finally {
        setAuthLoading(
          false
        );
      }
    }


    loadCurrentUser();
  }, []);


  async function login(
    credentials
  ) {
    await loginUser(
      credentials
    );

    const currentUser =
      await getCurrentUser();

    setUser(
      currentUser
    );

    return currentUser;
  }


  async function logout() {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  }


  const isAuthenticated =
    user !== null;


  const contextValue =
    useMemo(
      () => ({
        user,
        isAuthenticated,
        authLoading,
        login,
        logout,
      }),
      [
        user,
        isAuthenticated,
        authLoading,
      ]
    );


  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}