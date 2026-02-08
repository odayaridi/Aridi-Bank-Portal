import type { LoginPayload } from "../types/user/LoginPayload";
import axiosInstance from "./interceptor/axiosInstance";

// Function to log in a user
export const loginUser = async (payload: LoginPayload) => {
  try {
    const response = await axiosInstance.post("/auth/login", payload);
    return response.data.data; 
  }
  catch (error: any) {
    console.error("Error logging in:", error); // Log for debugging purposes
    throw error; // Re-throw to allow caller to handle the error
  }
};

// Function to log out the current user
export const logoutUser = async () => {
  try {
    await axiosInstance.post("/auth/logout");
  } catch (error: any) {
    console.error("Error logging out:", error);
    throw error;
  }
};

// Function to fetch the currently authenticated user's data
export const fetchCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/auth/me");
    return response.data.data.user; 
  } catch (error: any) {
    console.error("Error Verifying :", error); 
    throw error;
  }
};
