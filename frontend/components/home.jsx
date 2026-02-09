"use client";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import api from "@/lib/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => {
      window.location.href = "/login";
    });
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-neon text-3xl">
        Welcome, {user.username}
      </h1>

      <button
        className="btn mt-6"
        onClick={async () => {
          await api.post("/api/auth/logout");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
}
