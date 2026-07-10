import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";
import { ReactQueryProvider } from "@/components/providers/reactQueryProvider";
import { ErrorBoundary } from "@/components/common/errorBoundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - HotStock",
    default: "HotStock - Nền tảng phân tích đầu tư",
  },
  description: "HotStock - Nền tảng phân tích tài chính, thị trường chứng khoán, crypto, vàng và quản lý danh mục đầu tư chuyên nghiệp.",
  keywords: ["chứng khoán", "đầu tư", "phân tích tài chính", "crypto", "giá vàng", "cổ phiếu", "hotstock"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        themes={["light", "dark"]}
        storageKey="app-theme"
      >
        <ErrorBoundary>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ErrorBoundary>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
       
        
      </body>
    </html>
  );
}
