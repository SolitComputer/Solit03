import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth";

export default function ProtectedRoute({
  children
}) {

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {

    const currentUser =
      await getCurrentUser();

    setUser(currentUser);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}