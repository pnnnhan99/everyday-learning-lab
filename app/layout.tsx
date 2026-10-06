import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Everyday Science Sim — Virtual Chemistry Lab",
  description: "Trộn hoá chất gia dụng trong phòng lab ảo: tra cứu phản ứng, cảnh báo độc, lịch sử và quản trị dữ liệu.",
  metadataBase: new URL("https://everyday-science-sim.local"),
  openGraph: {
    title: "Everyday Science Sim",
    description: "Virtual chemistry lab with safe simulated reactions.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
