import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { authService } from "../services/authService";

export const useAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    logout: storeLogout,
  } = useAuthStore();
  // Initialize auth state khi app khởi động
  useEffect(() => {
    const initializeAuth = async () => {
      // Nếu có token và token còn hạn thì đã authenticated
      // Không cần gọi API vì user info đã có từ login
      if (accessToken && !authService.isTokenValid()) {
        // Token hết hạn, logout
        storeLogout();
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, [accessToken, storeLogout]);

  // Login function
  const login = async (credentials) => {
    const response = await authService.login(credentials);
    return response;
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    const response = await authService.forgotPassword(email);
    return response;
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    const response = await authService.resetPassword(token, newPassword);
    return response;
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    isInitialized,

    // Actions
    login,
    logout,
    forgotPassword,
    resetPassword,
  };
};
