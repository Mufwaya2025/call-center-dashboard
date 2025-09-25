import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth-provider";
import { ElectronWindowTitleBar } from "@/components/electron-desktop-bridge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Call Center Analytics Dashboard",
  description: "Comprehensive call center analytics and monitoring dashboard with real-time insights, agent performance tracking, and payment conversion analysis.",
  keywords: ["Call Center", "Analytics", "Dashboard", "Real-time", "Performance", "Monitoring", "VoIP", "PBX"],
  authors: [{ name: "Call Center Team" }],
  openGraph: {
    title: "Call Center Analytics Dashboard",
    description: "Real-time call center analytics and performance monitoring",
    url: "https://callcenter-dashboard.com",
    siteName: "Call Center Dashboard",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Call Center Analytics Dashboard",
    description: "Real-time call center analytics and performance monitoring",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ElectronWindowTitleBar />
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
