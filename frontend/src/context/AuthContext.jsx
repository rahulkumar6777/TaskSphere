import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { api, attachInterceptors } from "../api/apiclient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]               = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const navigate                      = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/me");
      setUser(res.data?.data.user || null);
    } catch {
      setUser(null);
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      await api.post("/refresh/refreshtoken");
      await fetchUser();
      return true;
    } catch {
      setUser(null);
      return false;
    }
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try { await api.post("/logout"); } catch {}
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);
  
  useEffect(() => {
    const eject = attachInterceptors(refreshAccessToken, logout);

  
    const init = async () => {
      const ok = await refreshAccessToken();
      if (!ok) {
        navigate("/login", { replace: true });
      }
      setIsAuthReady(true);
    };

    init();

    return eject;
  }, []);

  const registerInit = async (email, name) => {
    const res = await api.post("/register/init", { email, name });
    return res.data;
  };

  const registerVerify = async (email, otp, password, name) => {
    const res = await api.post("/register/verify", { email, otp, password, name });
    await fetchUser();
    navigate("/", { replace: true });
    return res.data;
  };

  const login = async (email, password) => {
    await api.post("/login", { email, password });
    await fetchUser();
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthReady,
        isAuthenticated: !!user,
        login,
        logout,
        registerInit,
        registerVerify,
        fetchUser,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};