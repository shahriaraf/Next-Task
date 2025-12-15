import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Next-Task",
  description: "Multi-Level Tree Component With State Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
