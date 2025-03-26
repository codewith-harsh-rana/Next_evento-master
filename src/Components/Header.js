"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaHome, FaUser, FaInfoCircle, FaPhone, FaSignOutAlt } from "react-icons/fa";

export default function Header() {
    const router = useRouter();

    return (
        <header className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
            <h1
                className="text-2xl font-bold cursor-pointer flex items-center gap-2"
                onClick={() => router.push("/")}
            >
                
                Evento
            </h1>
            <nav className="flex gap-6">
                <span
                    className="flex items-center gap-2 text-sm cursor-pointer hover:underline"
                    onClick={() => router.push("/")}
                >
                    <FaHome className="h-5 w-5" />
                    Home
                </span>
                <span
                    className="flex items-center gap-2 text-sm cursor-pointer hover:underline"
                    onClick={() => router.push("/about")}
                >
                    <FaInfoCircle className="h-5 w-5" />
                    About Us
                </span>
                <span
                    className="flex items-center gap-2 text-sm cursor-pointer hover:underline"
                    onClick={() => router.push("/contact")}
                >
                    <FaPhone className="h-5 w-5" />
                    Contact Us
                </span>
                <span
                    className="flex items-center gap-2 text-sm cursor-pointer hover:underline"
                    onClick={() => router.push("/profile")}
                >
                    <FaUser className="h-5 w-5" />
                    My Profile
                </span>
            </nav>
            <button
                onClick={() => signOut()}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-700 transition"
            >
                <FaSignOutAlt className="h-5 w-5" />
                Logout
            </button>
        </header>
    );
}
