import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkFusion — Bento-style Link in Bio",
  description: "Create customizable profile pages with draggable blocks. A minimalist, open-source Link-in-Bio editor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
