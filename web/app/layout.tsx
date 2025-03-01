import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { louize } from "./fonts";
import "./globals.css";
import { Logo } from "@/components/ui/logo";
import { NavTabs } from "@/components/nav-tabs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KillSaaS - Memento Mori",
  description: "A modern application with custom fonts",
  icons: {
    icon: "/black_rose.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${louize.variable} antialiased bg-[#F9FAFC] min-h-screen`}
      >
        <div className="max-w-[1200px] w-full mx-auto bg-white shadow-lg min-h-screen">
          <header className="p-8 border-b">
            <Logo size={24} />
          </header>
          <NavTabs />
          {children}
          <footer className="p-8 border-t flex items-center justify-center gap-4">
            <Logo size={24} />
          </footer>
        </div>
      </body>
    </html>
  );
}
