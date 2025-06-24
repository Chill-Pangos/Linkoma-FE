import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setAccessToken: (token) => set({ accessToken: token }),

      setRefreshToken: (token) => {
        set({ refreshToken: token });
        // Lưu refresh token vào cookie nếu cần
        if (token) {
          Cookies.set("refreshToken", token, { expires: 7 }); // 7 ngày
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),

      login: (userData, tokens) => {
        set({
          user: userData,
          accessToken: tokens.accessToken.token,
          isAuthenticated: true,
          isLoading: false,
        });

        // Lưu refresh token nếu có
        const refreshToken = Cookies.get("refreshToken");
        if (refreshToken) {
          set({ refreshToken });
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });

        // Xóa cookies
        Cookies.remove("refreshToken");

        // Xóa localStorage
        localStorage.removeItem("auth-storage");
      },

      updateUser: (userData) => set({ user: userData }),

      // Helper functions
      getToken: () => get().accessToken,
      getUser: () => get().user,
      isUserAuthenticated: () => get().isAuthenticated,
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
