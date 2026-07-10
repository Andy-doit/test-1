import type { Metadata } from "next";

import { UserFooter } from "@/components/user/userFooter";
import { UserBackground } from "@/components/user/userBackground";

import UserHeader from "@/components/user/userHeader";
import ZaloFloatingButton from "@/components/common/zaloButton";
import TikTokFloatingButton from "@/components/common/tiktokButton";
import Logo from "@/public/logo.svg";


export const metadata: Metadata = {
  title: "HotStock - Trang chủ",
  description: "HotStock - Nền tảng phân tích tài chính, thị trường chứng khoán, crypto, vàng và quản lý danh mục đầu tư chuyên nghiệp.",
  icons: [{ rel: "icon", url: Logo.src }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <UserHeader />

      <main className="flex-1 relative">
        <UserBackground />
        {children}
        <TikTokFloatingButton />
        <ZaloFloatingButton />
      </main>

      <UserFooter />
    </div>
  );
}
