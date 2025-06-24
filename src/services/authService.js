import axiosInstance from "./axiosConfig";
import { useAuthStore } from "../store/authStore";
import Cookies from "js-cookie";

export const authService = {
  // Đăng nhập
  login: async (credentials) => {
    try {
      useAuthStore.getState().setLoading(true);

      const response = await axiosInstance.post("/auth/login", credentials, {
        withCredentials: true, // Để nhận cookies
      });

      const { user, accessToken } = response.data; // Debug: Kiểm tra response headers và cookies
      console.log("Login response headers:", response.headers);
      console.log("Login response config:", response.config);
      console.log("Login response status:", response.status);

      // Lưu thông tin user và token vào store
      useAuthStore.getState().login(user, { accessToken });

      // Debug: Kiểm tra cookies (HttpOnly cookies sẽ không hiển thị)
      const allCookies = Cookies.get();
      console.log("JS accessible cookies after login:", allCookies);
      console.log("Document.cookie:", document.cookie);
      console.log(
        "Response Set-Cookie headers:",
        response.headers["set-cookie"]
      );

      console.log(
        "Login successful - refreshToken should be in HttpOnly cookie"
      ); // Debug log

      return response.data;
    } catch (error) {
      useAuthStore.getState().setLoading(false);
      throw error;
    }
  }, // Đăng xuất
  logout: async () => {
    try {
      console.log("Starting logout process..."); // Debug log

      // Debug: Log tất cả cookies trước khi logout
      console.log("All JS accessible cookies before logout:", Cookies.get());
      console.log("Document.cookie before logout:", document.cookie);

      // Thử gọi API logout với withCredentials để gửi HttpOnly cookie
      // Server sẽ tự động nhận refreshToken từ cookie
      const response = await axiosInstance.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      console.log("Logout API call successful", response.data); // Debug log
    } catch (error) {
      console.error("Logout error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          withCredentials: error.config?.withCredentials,
          headers: error.config?.headers,
        },
      });

      // Nếu API logout fail, vẫn tiếp tục clear local state
    } finally {
      // Luôn luôn clear local state dù API có lỗi hay không
      useAuthStore.getState().logout();
      console.log("Local state cleared"); // Debug log

      // Debug: Log cookies sau khi logout
      console.log("All JS accessible cookies after logout:", Cookies.get());
      console.log("Document.cookie after logout:", document.cookie);
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken =
        useAuthStore.getState().refreshToken || Cookies.get("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axiosInstance.post(
        "/auth/refresh-token",
        {},
        {
          headers: {
            Cookie: `refreshToken=${refreshToken}`,
          },
          withCredentials: true,
        }
      );

      const { accessToken } = response.data;
      useAuthStore.getState().setAccessToken(accessToken.token);

      return response.data;
    } catch (error) {
      useAuthStore.getState().logout();
      throw error;
    }
  },

  // Kiểm tra token còn hạn không
  isTokenValid: () => {
    const token = useAuthStore.getState().accessToken;
    if (!token) return false;

    try {
      // Decode JWT token để kiểm tra expiry
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await axiosInstance.post("/auth/reset-password", {
      token,
      password: newPassword,
    });
    return response.data;
  },
};

export default authService;
