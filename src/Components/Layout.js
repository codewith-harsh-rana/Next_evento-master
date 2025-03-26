"use client";

import { useSession } from "next-auth/react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  const { data: session } = useSession();

  return (
    <>
      {session && <Header />} {/* Show Header if logged in */}
      <main>{children}</main>
      {session && <Footer />} {/* Show Footer if logged in */}
    </>
  );
}
