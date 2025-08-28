import React from "react";
import Header from "./header";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title={title} />
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
};

export default Layout;
