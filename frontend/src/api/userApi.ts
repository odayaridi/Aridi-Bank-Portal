import type { CreateUser } from "../types/user/CreateUser";
import type { DeleteUser } from "../types/user/DeleteUser";
import type { UpdateUser } from "../types/user/UpdateUser";
import axiosInstance from "./interceptor/axiosInstance";

//Create a new user
export const createUser = async (user: CreateUser) => {
  try {
    const response = await axiosInstance.post('/users/create', user);
    return response.data.data; // Return created user data
  } catch (error) {
    console.error('Error creating user:', error); // Log the error
    throw error; // Propagate the error
  }
};


// Fetch users based on filters (pagination, search, etc.)
export const fetchFilteredUsers = async (filters: Record<string, any>) => {
  try {
    const { data } = await axiosInstance.get("/users/getFilteredUsers", {
      params: filters, // Pass filters as query parameters
    });

    const result = data?.data || {}; // Safe access to nested data
    return {
      users: result.users || [],        // List of users
      total: result.total || 0,         // Total number of users
      page: result.page || 1,           // Current page
      limit: result.limit || 10,        // Number of users per page
      totalPages: result.totalPages || 1, // Total number of pages
    };
  } catch (error: any) {
    console.error("Error fetching filtered users:", error); // Log the error
    throw error; // Propagate the error
  }
};

// Update an existing user
export const updateUser = async (updateData: UpdateUser) => {
  try {
    const { data } = await axiosInstance.put("/users/update", updateData);
    return data; // Return updated user response
  } catch (error: any) {
    console.error("Error updating user:", error); // Log the error
    throw error; // Propagate the error
  }
};

// Delete a user by username
export const deleteUser = async ({ username }: DeleteUser) => {
  try {
    await axiosInstance.delete(`/users/delete/${username}`); // Perform deletion
  } catch (error: any) {
    console.error("Error deleting user:", error); // Log the error
    throw error; // Propagate the error
  } 
}; 


export const getCardHolders = async (page = 1, search = "") => {
  try {
    const res = await axiosInstance.get("/users/card-holders", {
      params: { page, limit: 5, search },
    });

    return res.data?.data; // same style as getAllAccountNbsInSystem
  } catch (err) {
    console.error("Error fetching card holders:", err);
    throw err;
  }
};


export const getAllUsernames = async (page = 1, search = "") => {
  try {
    const res = await axiosInstance.get("/users/all-usernames", {
      params: { page, limit: 5, search },
    });
    return res.data?.data;
  } catch (err) {
    console.error("Error fetching usernames:", err);
    throw err;
  }
};



/**
 * NEW: Requests a password reset.
 * The backend now sends an actual email via SMTP.
 */
export const requestPasswordReset = async (email: string) => {
  try {
    // Matches @Post('request-reset') in AuthController
    const response = await axiosInstance.post('/auth/request-reset', { email });
    return response.data; 
  } catch (error) {
    throw error;
  }
};

/**
 * NEW: Performs the password reset.
 * Matches @Post('reset-password') in AuthController
 */
export const resetPassword = async (data: { token: string; id: string; newPassword: string }) => {
  try {
    const response = await axiosInstance.post('/auth/reset-password', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};




// Fetch total number of normal users (Analytics KPI)
export const fetchTotalUsers = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get('/users/total-normal-users');
    return response.data?.data?.totalUsers || 0;
  } catch (error: any) {
    console.error('Error fetching total users:', error);
    throw error;
  }
};
