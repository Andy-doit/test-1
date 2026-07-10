import type { Metadata } from "next";

import { UserFooter } from "@/components/user/userFooter";
import { UserBackground } from "@/components/user/userBackground";

import UserHeader from "@/components/user/userHeader";
import ZaloFloatingButton from "@/components/common/zaloButton";
import TikTokFloatingButton from "@/components/common/tiktokButton";
import Logo from "@/public/logo.svg";


export const metadata: Metadata = {
  title: "HotStock",
  description: "Kiến tạo tăng trưởng",
  icons: [{ rel: "icon", url: Logo.src }],
};

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserHeader/>
      {children}
      <TikTokFloatingButton />
      <ZaloFloatingButton />
      <UserBackground />
      <UserFooter/>
    </>
  );
}

