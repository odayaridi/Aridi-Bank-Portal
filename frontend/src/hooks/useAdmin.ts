import { createUser } from "../api/userApi";
import type { CreateUser } from "../types/user/CreateUser";

/**
 * Custom hook for admin-related user operations.
 */
export function useAdmin() {
  /**
   * Adds a new user by calling the createUser API.
   * 
   * @param user - The user object to create (matches CreateUser type)
   * @returns The newly created user object from the API
   */
  const addUser = async (user: CreateUser) => {
    const newUser = await createUser(user);
    return newUser;
  };

  return { addUser };
}
