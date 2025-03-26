"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ street: "", city: "", state: "", country: "", zipCode: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    }
  }, [session, status]);

  if (status === "loading") {
    return <p className="text-center text-lg font-semibold text-gray-600 mt-5">Checking session...</p>;
  }

  if (!session) {
    return <p className="text-center text-lg font-semibold text-gray-600 mt-5">Redirecting to login...</p>;
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/address", {
        method: "POST",
        body: JSON.stringify({ ...formData, userId: session?.user?.id }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add address");
      }

      setIsModalOpen(false);
      setFormData({ street: "", city: "", state: "", country: "", zipCode: "" });
      router.push("/AddressList");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-5">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {session?.user?.name}!</h2>
        <p className="text-sm text-gray-600 mb-4">{session?.user?.email}</p>
        {session?.user?.image && (
          <img
            src={session?.user?.image}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-blue-500"
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
        <button
          onClick={() => signOut()}
          className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold mb-3 hover:bg-red-600"
        >
          Logout
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold mb-3 hover:bg-blue-600"
        >
          Add Address
        </button>
        <button
          onClick={() => router.push("/AddressList")}
          className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600"
        >
          View Address
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-5">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Add Address</h3>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <input
              type="text"
              name="street"
              placeholder="Street"
              value={formData.street}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleAddAddress}
              className={`w-full py-2 rounded-lg font-semibold mb-3 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
