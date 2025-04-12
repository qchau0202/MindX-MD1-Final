import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Khôi phục trạng thái đăng nhập khi reload
  useEffect(() => {
    const restoreSession = async () => {
      if (token) {
        try {
          const response = await getCurrentUser();
          console.log("Restore session response:", response.data);
          if (response.data.success) {
            setUser(response.data.data);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Error restoring session:", error);
          logout();
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token", authToken);
    console.log("Login:", { user: userData, token: authToken });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    console.log("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
