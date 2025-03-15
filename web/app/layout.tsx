import type { Metadata, Viewport } from "next";
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
  description: "Killing SaaS one by one",
  icons: {
    icon: "/black_rose.svg",
    apple: "/black_rose.svg",
    shortcut: "/black_rose.svg",
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
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
          <header className="p-4 sm:p-6 md:p-8 border-b flex items-center justify-center">
            <Logo size={24} />
          </header>
          <NavTabs />
          {children}
          <footer className="p-4 sm:p-6 md:p-8 border-t flex items-center justify-center gap-4">
            <Logo size={24} />
          </footer>
        </div>
      </body>
    </html>
  );
}
