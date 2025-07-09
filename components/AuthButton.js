"use client";
import { useAuth } from "@/context/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/client";
import Link from "next/link";
import React from "react";

const AuthButton = () => {
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    if (!auth) return;

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="animate-pulse bg-gray-300 h-8 w-16 rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <>
          <span className="text-sm text-gray-600">Welcome, {user.email}</span>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          href="/admin/login"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login
        </Link>
      )}
    </div>
  );
};

export default AuthButton;
