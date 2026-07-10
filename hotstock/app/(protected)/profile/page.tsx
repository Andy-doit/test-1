"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ProfileContent } from "@/components/profile/profileContent";
import { UserBackground } from "@/components/user/userBackground";
import { useAuthServer } from "@/hooks/useAuthServer";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, checkProfile } = useAuthServer();
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  // Khi vào trang profile, luôn cố gắng đồng bộ user từ token trong cookie
  useEffect(() => {
    let isMounted = true;
    (async () => {
      await checkProfile();
      if (isMounted) {
        setHasChecked(true);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [checkProfile]);

  // Nếu đã kiểm tra xong mà không còn đăng nhập thì đưa về trang login
  useEffect(() => {
    // Chỉ redirect sau khi đã chạy xong ít nhất một lần checkProfile
    if (hasChecked && !isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hasChecked, isLoading, isAuthenticated, router]);

  if (!hasChecked || isLoading || (!user && isAuthenticated)) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <UserBackground />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="rounded-2xl border border-border/40 bg-card/80 px-6 py-8 shadow-xl backdrop-blur-sm flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Đang tải hồ sơ của bạn...</p>
          </div>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập (và không còn loading), useEffect phía trên sẽ tự redirect
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <UserBackground />
      <div className="relative z-10 min-h-screen py-8 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ProfileContent initialUser={user} />
        </div>
      </div>
    </div>
  );
}
