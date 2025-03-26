"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Layout from "@/Components/Layout"; // Import Layout component

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Layout>{children}</Layout> {/* Wrap in Layout */}
        </SessionProvider>
      </body>
    </html>
  );
}
