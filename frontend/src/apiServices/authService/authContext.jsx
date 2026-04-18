import { createContext, useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import { setSession, getSession, clearSession } from "./tokenStorage";
import { loginRequest, registerRequest } from "./authService";
import { createApiClient } from "../apiClient";

export const AuthContext = createContext(null);

// Backward compatibility: useAuth.js imports `authContext` (lowercase)
export const authContext = AuthContext;

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verify existing session on mount
  useEffect(() => {
    const session = getSession();
    if (session?.accessToken) {
      setUser({
        name: session.name,
        email: session.email,
        userId: session.userId,
        rol: session.rol,
      });
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setIsAuthenticated(false);
    navigate("/");
  }, [navigate]);

  // Create apiClient once, stable reference via ref to avoid recreating on every render
  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  const apiClient = useMemo(
    () => createApiClient(() => logoutRef.current()),
    []
  );

  const login = useCallback(async (email, password) => {
    try {
      const data = await loginRequest(email, password);
      const sessionData = {
        accessToken: data.token,
        refreshToken: data.refreshToken,
        email: data.email,
        userId: String(data.userId),
        name: data.name,
        rol: data.rol,
      };
      setSession(sessionData);
      setUser({
        name: data.name,
        email: data.email,
        userId: String(data.userId),
        rol: data.rol,
      });
      setIsAuthenticated(true);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const register = useCallback(async (name, email, password, idRol) => {
    try {
      await registerRequest(name, email, password, idRol);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const updateUser = useCallback((userData) => {
    setUser((prev) => {
      const updated = { ...prev, ...userData };
      // Sync to TokenStorage
      const session = getSession();
      if (session) {
        setSession({
          ...session,
          name: updated.name,
          email: updated.email,
          userId: updated.userId,
          rol: updated.rol,
        });
      }
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      loading,
      login,
      logout,
      register,
      updateUser,
      apiClient,
    }),
    [isAuthenticated, user, loading, login, logout, register, updateUser, apiClient]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
