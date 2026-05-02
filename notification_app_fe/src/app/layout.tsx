"use client";
import type { Metadata } from "next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: "#f0f2f5", fontFamily: "Arial, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}