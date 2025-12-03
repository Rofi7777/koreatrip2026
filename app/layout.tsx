import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ScrollToTop } from "@/components/ScrollToTop";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Korea Trip Assistant 2026",
  description: "Plan and optimize your 2026 Korea trip with an intelligent assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-fixed text-gray-900 antialiased`}
      >
        <ScrollToTop />
        <div className="min-h-screen flex items-start justify-center px-4 py-4">
          <div className="w-full mx-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
