import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeToggle from "@/components/theme-toggle"; // Assuming ThemeToggle is located here

// Import custom fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Update the metadata for AdmitCompass
export const metadata: Metadata = {
  title: "AdmitCompass - UMBC Engineering Programs",
  description:
    "AdmitCompass helps prospective UMBC students assess their chances for admission to engineering programs. Explore programs, track applications, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background-light dark:bg-background-dark transition duration-300`}
      >
        {/* Global Theme Toggle and Branding */}
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-brand-light dark:text-brand-dark">
            Admit Compass
          </h1>
          <ThemeToggle />
        </div>

        {/* Main content */}
        {children}
      </body>
    </html>
  );
}
