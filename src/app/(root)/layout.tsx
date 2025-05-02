import React from "react";
import { Toaster } from "sonner";
import "sonner/dist/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-20">
      <Toaster richColors position="top-right" />
      {children}
    </div>
  );
}
