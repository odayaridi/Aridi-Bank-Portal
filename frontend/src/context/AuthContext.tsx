import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types/user/User';

// Define the shape of the AuthContext
// It will store the current user and a function to update it
interface AuthContextType {
  user: User | null; // Currently logged-in user or null if not authenticated
  setUser: (user: User) => void; // Function to update the user in context
}

// Create a React context with the above type
// Initial value is undefined to enforce using the provider
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps the app and provides the auth state
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // State to store the current user, initialized as null
  const [user, setUser] = useState<User | null>(null);

  return (
    // Provide the user state and setUser function to all children components
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the AuthContext
export const useAuth = () => {
  // Retrieve context value
  const context = useContext(AuthContext);

  // Throw an error if hook is used outside of AuthProvider
  if (!context) throw new Error('useAuth must be used within AuthProvider');

  // Return the context value (user and setUser)
  return context;
};
