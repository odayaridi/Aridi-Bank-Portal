import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types/user/User';

/**
 * ProtectedRouteProps
 *
 * Props for the ProtectedRoute component:
 * - role: The role required to access this route (e.g., "Admin" or "User")
 * - children: The React nodes to render if access is allowed
 */
interface ProtectedRouteProps {
  role: User['roleName'];
  children: ReactNode;
}

/**
 * ProtectedRoute Component
 *
 * Wraps routes that require authentication and role-based access control.
 *
 * Behavior:
 * 1. If no user is logged in, redirects to the login page.
 * 2. If the logged-in user's role does not match the required role, redirects to the home page.
 * 3. If the user is authenticated and has the correct role, renders the child components.
 *
 */
const ProtectedRoute = ({ role, children }: ProtectedRouteProps) => {
  const { user } = useAuth();

  // Redirect unauthenticated users to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect users with insufficient role to home page
  if (user.roleName !== role) {
    return <Navigate to="/" replace />;
  }

  // Render protected content for authorized users
  return <>{children}</>;
};

export default ProtectedRoute;




// import { Navigate } from "react-router-dom";
// import { type ReactNode } from "react";
// import { useAuth } from "../context/AuthContext";
// import type { User } from "../types/user/User";

// interface ProtectedRouteProps {
//   role: User["roleName"];
//   children: ReactNode;
// }

// const ProtectedRoute = ({ role, children }: ProtectedRouteProps) => {
//   const { user, loading } = useAuth();
//   if (loading) {
//     return <div ></div>;
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (user.roleName !== role) {
//     return <Navigate to="/home" replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;

