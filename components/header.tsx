import React from "react";
import Link from "next/link";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-bold">{title || "BBSPJIT Magang"}</h1>
      <nav className="flex items-center gap-4">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/pendaftaran" className="hover:underline">Pendaftaran</Link>
        <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
      </nav>
    </header>
  );
};

export default Header;
