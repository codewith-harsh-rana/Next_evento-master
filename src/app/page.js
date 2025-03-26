"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session]);

  if (!session) {
    return <p className="text-center text-lg text-gray-600 mt-12">Redirecting to login...</p>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-5">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-5">Welcome to Event Website</h1>
        <h2 className="text-lg text-gray-600 mb-4">
          This is the event management website where you can create and manage events.
        </h2>
        <h3 className="text-base text-gray-500 mb-6">
          You can also view the events created by other users.
        </h3>

        <div className="flex justify-between gap-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded font-bold flex-1">
            <a href="/events" className="no-underline text-white">
              View Events
            </a>
          </button>

          <button className="bg-blue-500 text-white py-2 px-4 rounded font-bold flex-1">
            <a href="/create" className="no-underline text-white">
              Create Event
            </a>
          </button>
        </div>
      </div>
    </div>
  );
}
