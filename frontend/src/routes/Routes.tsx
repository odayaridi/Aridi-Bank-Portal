import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AdminLayout from "../components/layout/AdminLayout";
import UserLayout from "../components/layout/UserLayout";

// Admin Pages
import CreateUser from "../pages/admin/CreateUser";
import CreateAccount from "../pages/admin/CreateAccount";
import DebitCard from "../pages/admin/DebitCard";
import DepositWithdraw from "../pages/admin/DepositWithdraw";
import Users from "../pages/admin/Users";
import ContactMessages from "../pages/admin/ContactMessages";

// Auth & Other Pages
import Login from "../pages/auth/Login";
import Home from "../pages/home/Home";
import Transaction from "../pages/user/Transactions";
import ContactUs from "../pages/user/ContactUs";
import Accounts from "../pages/user/Accounts";
import Dashboard from "../pages/user/Dashboard";
import Profile from "../pages/user/Profile";
import NotFound from "../pages/notfound/NotFound";

// Protected Route Component
import ProtectedRoute from "./ProtectedRoute";
import ForgetPass from "../pages/auth/ForgetPass";
import ResetPass from "../pages/auth/ResetPass";
import Chatbot from "../pages/home/Chatbot";
import Forbidden from "../forbidden/Forbidden";
import Analytics from "../pages/admin/Analytics";


/**
 * AppRoutes Component
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* === Redirect root (/) to /home === */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* === Public Routes === */}
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
       <Route path="/chatbot" element={<Chatbot />} />
      {/* 👇 Added these two routes */}
      <Route path="/forgot-password" element={<ForgetPass />} />
      <Route path="/reset-password" element={<ResetPass />} />
      <Route path="/accessforbidden" element={<Forbidden />} />
      {/* === Admin Routes (Protected) === */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="Admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="analytics" replace />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="create-user" element={<CreateUser />} />
        <Route path="create-account" element={<CreateAccount />} />
        <Route path="debit-cards" element={<DebitCard />} />
        <Route path="deposit-withdraw" element={<DepositWithdraw />} />
        <Route path="users" element={<Users />} />
        <Route path="messages" element={<ContactMessages />} />
      </Route>

      {/* === User Routes (Protected) === */}
      <Route
        path="/user/*"
        element={
          <ProtectedRoute role="User">
            <UserLayout />
          </ProtectedRoute>
        }
      />

      <Route path="/user" element={<UserLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="transactions" element={<Transaction />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* === Catch-All Route for 404 Not Found === */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

