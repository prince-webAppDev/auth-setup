"use client";
import { useState } from "react";
import api from "@/lib/api";

export default function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const submit = async e => {
    e.preventDefault();
    await api.post("/api/auth/register", form);
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={submit}
        className="bg-black border border-neon p-8 rounded-xl w-96"
      >
        <h1 className="text-neon text-2xl mb-6">Sign Up</h1>

        <input
          placeholder="Username"
          className="input"
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <input
          placeholder="Email"
          className="input mt-3"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="input mt-3"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button className="btn mt-6">Create Account</button>
      </form>
    </div>
  );
}
