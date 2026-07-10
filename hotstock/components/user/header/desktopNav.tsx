"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { USER_MENU_ITEMS, MARKET_SUBMENU_ITEMS, PORTFOLIO_SUBMENU_ITEMS } from "@/lib/constants/menu";
import { useCategoriesQuery } from "@/hooks/useCategoriesQuery";
import { DropdownNav } from "./dropdownNav";

export function DesktopNav() {
  const [mounted, setMounted] = useState(false);
  const { data: categories } = useCategoriesQuery();

  const analysisItems = [
    ...(categories?.map((c) => ({
      label: c.name,
      href: `/news/${c.slug}`,
    })) ?? []),
    { label: "Lịch kinh tế", href: "/news/calenderEconomic" },
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="hidden min-[1400px]:flex items-center gap-8">
        {USER_MENU_ITEMS.map((item) => {
          const isLiveMarket = item.title === 'Thị trường live';
          const isAnalysis = item.title === 'Phân tích ';
          const isPortfolio = item.title === 'Danh mục đầu tư';
          
          if (!isLiveMarket && !isAnalysis && !isPortfolio) {
            return (
              <Link
                key={`${item.href}-${item.title}`}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-[color:var(--title)] transition-colors whitespace-nowrap"
              >
                {item.title}
              </Link>
            );
          }
          
          return (
            <Link
              key={`${item.href}-${item.title}`}
              href={isLiveMarket ? '/market' : isAnalysis ? '/news' : '/portfolio'}
              className="text-sm font-medium text-foreground/80 hover:text-[color:var(--title)] transition-colors whitespace-nowrap inline-flex items-center gap-1"
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="hidden min-[1400px]:flex items-center gap-8" suppressHydrationWarning>
      {USER_MENU_ITEMS.map((item) => {
        const isLiveMarket = item.title === 'Thị trường live';
        const isAnalysis = item.title === 'Phân tích ';
        const isPortfolio = item.title === 'Danh mục đầu tư';

        if (!isLiveMarket && !isAnalysis && !isPortfolio) {
          return (
            <Link
              key={`${item.href}-${item.title}`}
              href={item.href}
              className="text-sm font-medium text-foreground/80 hover:text-[color:var(--title)] transition-colors whitespace-nowrap"
            >
              {item.title}
            </Link>
          );
        }

        if (isLiveMarket) {
          return (
            <DropdownNav
              key={`${item.href}-${item.title}`}
              title={item.title}
              baseHref="/market"
              items={MARKET_SUBMENU_ITEMS}
            />
          );
        }

        if (isAnalysis) {
          return (
            <DropdownNav
              key={`${item.href}-${item.title}`}
              title={item.title}
              baseHref="/news"
              items={analysisItems}
            />
          );
        }

        // Portfolio dropdown
        return (
          <DropdownNav
            key={`${item.href}-${item.title}`}
            title={item.title}
            baseHref="/portfolio"
            items={PORTFOLIO_SUBMENU_ITEMS}
            className="w-72 max-w-[22rem]"
          />
        );
      })}
    </nav>
  );
}

