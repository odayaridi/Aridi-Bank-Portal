import axios from "axios";
import { logoutUser } from "../authApi";

/**
 * Axios instance configuration
 *
 * This instance sets up:
 * - baseURL: All requests will be prefixed with this URL
 * - headers: Default headers for JSON requests
 * - withCredentials: Ensures cookies (e.g., JWT tokens) are sent with requests
 */
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * Response interceptor
 *
 * Automatically handles responses and errors:
 * - Returns response directly if successful
 * - For 401 Unauthorized errors:
 *    1. Checks if the request was not a login attempt
 *    2. Logs out the user via backend API
 *    3. Redirects to the login page
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 errors
    if (error.response?.status === 401) {
      const isAuthRoute = originalRequest?.url?.includes("/login");

      if (!isAuthRoute) {
        console.warn("JWT expired or unauthorized, logging out...");

        try {
          // Call backend logout endpoint to clear authentication cookie
          await logoutUser();
        } catch (logoutError) {
          console.error("Error during auto logout:", logoutError);
        }

        // Redirect user to login page
        window.location.href = "/login";
      }
    }

    // Reject the error for other error handling
    return Promise.reject(error);
  }
);

export default axiosInstance;
