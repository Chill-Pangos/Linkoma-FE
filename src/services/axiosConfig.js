import axios from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "../store/authStore";

// Base URL cho API
const BASE_URL = "https://linkoma-be.onrender.com/v1";

// Tạo instance của axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true, // Quan trọng: để gửi cookies (HttpOnly cookies)
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

// Request interceptor - thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý refresh token
axiosInstance.interceptors.response.use(
  (response) => {
    // Kiểm tra và lưu refresh token từ cookie
    const refreshToken = Cookies.get("refreshToken");
    if (refreshToken) {
      useAuthStore.getState().setRefreshToken(refreshToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          useAuthStore.getState().refreshToken || Cookies.get("refreshToken");

        if (refreshToken) {
          // Gọi API refresh token
          const response = await axios.post(
            `${BASE_URL}/auth/refresh-token`,
            {},
            {
              headers: {
                Cookie: `refreshToken=${refreshToken}`,
              },
              withCredentials: true,
            }
          );

          const { accessToken } = response.data;

          // Cập nhật token mới
          useAuthStore.getState().setAccessToken(accessToken.token);

          // Retry request ban đầu với token mới
          originalRequest.headers.Authorization = `Bearer ${accessToken.token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token hết hạn, đăng xuất người dùng
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
