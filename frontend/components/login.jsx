"use client";
import { useState } from "react";
import api from "@/lib/api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });

  const login = async e => {
    e.preventDefault();
    await api.post("/api/auth/login", form);
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-black border border-neon p-8 rounded-xl w-96">
        <h1 className="text-neon text-2xl mb-6">Login</h1>

        <form onSubmit={login}>
          <input
            placeholder="Username"
            className="input"
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="input mt-3"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <button className="btn mt-6">Login</button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() =>
              (window.location.href =
                "http://localhost:3210/api/auth/google")
            }
            className="border border-neon px-4 py-2 rounded text-neon"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
