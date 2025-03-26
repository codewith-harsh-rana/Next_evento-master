"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FaGoogle } from "react-icons/fa";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (res?.error) {
      Swal.fire({
        title: "Error",
        text: res.error,
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } else {
      Swal.fire({
        title: "Success!",
        text: "Login successful.",
        icon: "success",
        confirmButtonColor: "#16a34a",
      }).then(() => {
        router.push("/profile");
      });
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-blue-500 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-4">
            <label className="block text-left font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@example.com"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-left font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full p-2 rounded-md text-white font-bold ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="my-4 font-bold">OR</p>

        <button
          onClick={handleGoogleLogin}
          className="w-full p-2 flex items-center justify-center bg-red-500 text-white rounded-md font-bold hover:bg-red-600"
        >
          <FaGoogle className="mr-2" />
          Login with Google
        </button>

        <p className="mt-4 text-sm">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 font-bold hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
