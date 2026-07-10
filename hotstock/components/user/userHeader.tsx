"use client";

import { useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/common/themeSwitch";
import { useAuthServer } from "@/hooks/useAuthServer";
import { DesktopNav } from "./header/desktopNav";
import { MobileNav } from "./header/mobileNav";
import { PlanBadge } from "./header/planBadge";
import { UserMenu } from "./header/userMenu";
import { getPlanName } from "./header/planBadge";

export { getPlanName };

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function UserHeader() {
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const { user, isAuthenticated, logout, checkProfile } = useAuthServer();

  // Luôn check profile khi header mount để đọc trạng thái đăng nhập từ cookie
  useEffect(() => {
    checkProfile();
  }, [checkProfile]);

  // Refresh user khi window được focus lại (ví dụ: quay lại từ trang membership)
  useEffect(() => {
    const handleFocus = () => {
      checkProfile();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkProfile]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header
      className="w-full bg-background/10 supports-[backdrop-filter]:backdrop-blur-md border-b fixed inset-x-0 top-0 z-50 transition-colors"
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between min-[1400px]:grid min-[1400px]:grid-cols-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 relative">
            <Image src="/logo1.svg" alt="HotStock Logo" width={28} height={28} className="h-7 w-auto" />
            <Image src="/logo2.svg" alt="HotStock Text" width={120} height={28} className="h-7 w-auto" />
          </Link>
        </div>

        <div
          className="hidden min-[1400px]:flex items-center justify-center"
          suppressHydrationWarning
        >
          <DesktopNav />
        </div>

        <div className="hidden min-[1400px]:flex items-center justify-end gap-3">
          <ThemeToggle />
          {isAuthenticated && user ? (
            <>
              <PlanBadge plan={user.plan ?? null} />
              <UserMenu user={user} onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button asChild variant="brand" className="rounded-xl">
                <Link href="/register">Mở tài khoản</Link>
              </Button>
            </>
          )}
        </div>

        <div
          className="flex items-center justify-end gap-3 min-[1400px]:hidden"
          suppressHydrationWarning
        >
          {mounted ? (
            <>
              <ThemeToggle />
              <MobileNav
                user={user}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                onClose={() => {}}
              />
            </>
          ) : (
            <>
              <ThemeToggle />
              <Button
                aria-label="Mở menu"
                variant="ghost"
                size="icon"
                className="text-foreground"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        .min-\[1400px\]\:flex button[variant='ghost'],
        .min-\[1400px\]\:flex button {
          background-color: transparent !important;
        }
        .min-\[1400px\]\:flex button:hover {
          background-color: transparent !important;
        }
        .min-\[1400px\]\:flex [data-state='open'] {
          background-color: transparent !important;
        }

        [role='menuitem']:hover,
        [role='menuitem'][data-highlighted],
        [role='menuitem']:focus {
          background-color: transparent !important;
          color: var(--title) !important;
        }

        .dark button[aria-label="Chuyển giao diện"] svg {
          color: #fbbf24;
          filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.75))
            drop-shadow(0 0 12px rgba(251, 191, 36, 0.5));
          transition: filter 200ms ease, color 200ms ease;
        }

        /* Đảm bảo các menu link luôn clickable */
        nav.hidden.min-\[1400px\]\:flex a {
          position: relative;
          z-index: 10;
          pointer-events: auto !important;
        }
      `}</style>
    </header>
  );
}
