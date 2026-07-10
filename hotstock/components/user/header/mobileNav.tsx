"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose, DrawerTrigger, DrawerFooter } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { USER_MENU_ITEMS, MARKET_SUBMENU_ITEMS, PORTFOLIO_SUBMENU_ITEMS } from "@/lib/constants/menu";
import { useCategoriesQuery } from "@/hooks/useCategoriesQuery";
import { MobileUserAvatar } from "./mobileUserAvatar";

interface MobileNavProps {
  user: { username?: string; email?: string; plan?: { name?: string; slug?: string } | null } | null;
  isAuthenticated: boolean;
  onLogout: () => void;
  onClose: () => void;
}

export function MobileNav({ user, isAuthenticated, onLogout, onClose }: MobileNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileLiveOpen, setMobileLiveOpen] = useState(false);
  const [mobileAnalysisOpen, setMobileAnalysisOpen] = useState(false);
  const [mobilePortfolioOpen, setMobilePortfolioOpen] = useState(false);

  const { data: categories } = useCategoriesQuery();
  
  const analysisItems = [
    ...(categories?.map((c) => ({
      label: c.name,
      href: `/news/${c.slug}`,
    })) ?? []),
    { label: "Lịch kinh tế", href: "/news/calenderEconomic" },
  ];

  const closeMobile = () => {
    setMobileOpen(false);
    onClose();
  };

  const handleLogout = async () => {
    await onLogout();
    closeMobile();
  };

  return (
    <>
      <Drawer open={mobileOpen} onOpenChange={setMobileOpen} direction="right">
        <DrawerTrigger asChild>
          <Button
            aria-label="Mở menu"
            variant="ghost"
            size="icon"
            className="text-foreground"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="min-[1400px]:hidden">
          <DrawerHeader className="flex-row items-center justify-between text-left">
            <DrawerTitle>Menu</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" aria-label="Đóng menu">
                <X className="h-6 w-6" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <nav className="px-2 pb-3 space-y-1">
            {USER_MENU_ITEMS.map((item) => {
              const isLive = item.title === 'Thị trường live';
              const isAnalysis = item.title === 'Phân tích ';
              const isPortfolio = item.title === 'Danh mục đầu tư';

              if (isLive) {
                return (
                  <div key={`${item.href}-${item.title}`} className="rounded-md">
                    <div className="flex items-center">
                      <Link
                        href="/thi-truong"
                        onClick={closeMobile}
                        className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                      >
                        {item.title}
                      </Link>
                      <Button
                        aria-label="Mở submenu thị trường live"
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileLiveOpen((v) => !v)}
                        className="ml-1 text-foreground hover:bg-accent"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${mobileLiveOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                    {mobileLiveOpen && (
                      <div className="ml-3 pb-2 space-y-1">
                        {MARKET_SUBMENU_ITEMS.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={closeMobile}
                            className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (isAnalysis) {
                return (
                  <div key={`${item.href}-${item.title}`} className="rounded-md">
                    <div className="flex items-center">
                      <Link
                        href="/phan-tich"
                        onClick={closeMobile}
                        className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                      >
                        {item.title}
                      </Link>
                      <Button
                        aria-label="Mở submenu phân tích thị trường"
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileAnalysisOpen((v) => !v)}
                        className="ml-1 text-foreground hover:bg-accent"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${mobileAnalysisOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                    {mobileAnalysisOpen && (
                      <div className="ml-3 pb-2 space-y-1">
                        {analysisItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={closeMobile}
                            className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (isPortfolio) {
                return (
                  <div key={`${item.href}-${item.title}`} className="rounded-md">
                    <div className="flex items-center">
                      <Link
                        href="/danh-muc-dau-tu"
                        onClick={closeMobile}
                        className="flex-1 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                      >
                        {item.title}
                      </Link>
                      <Button
                        aria-label="Mở submenu danh mục"
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobilePortfolioOpen((v) => !v)}
                        className="ml-1 text-foreground hover:bg-accent"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${mobilePortfolioOpen ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                    {mobilePortfolioOpen && (
                      <div className="ml-3 pb-2 space-y-1">
                        {PORTFOLIO_SUBMENU_ITEMS.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={closeMobile}
                            className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={`${item.href}-${item.title}`}
                  href={item.href}
                  onClick={closeMobile}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
          <Separator />
          <DrawerFooter>
            {isAuthenticated && user ? (
              <>
                <MobileUserAvatar user={user} />
                <Button asChild variant="outline" className="w-full justify-center">
                  <Link href="/profile" onClick={closeMobile}>
                    <User className="mr-2 h-4 w-4" />
                    Hồ sơ
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full justify-center">
                  <Link href="/login" onClick={closeMobile}>Đăng nhập</Link>
                </Button>
                <Button asChild variant="brand" className="w-full justify-center">
                  <Link href="/register" onClick={closeMobile}>Mở tài khoản</Link>
                </Button>
              </>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

