"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, ExternalLink } from "lucide-react";
import { MARKET_SOURCES } from "../sources";

export default function CryptoBitcoinPage() {
  const [isLoading, setIsLoading] = useState(true);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const src = MARKET_SOURCES.CRYPTO;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver((ents) => {
      if (ents[0].isIntersecting) { setInView(true); io.disconnect(); }
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative py-25 overflow-hidden">
      {/* Background: dùng nền mặc định theo theme, bỏ overlay trắng */}

      <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="inline-flex items-center gap-2">
            <Badge className="bg-gradient-to-tr from-[#5C278B] to-[#A084FB] text-white">Crypto</Badge>
            <Badge variant="outline" className="border-[#7042E1]/30 text-[#7042E1]">Bitcoin</Badge>
            <Badge variant="outline" className="border-[#7042E1]/30 text-[#7042E1]">Market Overview</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] bg-gradient-to-tr from-[#5C278B] to-[#A084FB] leading-relaxed bg-clip-text text-transparent">Thị Trường Crypto</h1>
          <p className="text-foreground/70 max-w-2xl">Theo dõi giá, vốn hóa, khối lượng giao dịch của Bitcoin và toàn bộ thị trường crypto theo thời gian thực, hiển thị bằng USD.</p>
        </div>
        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="border-border" onClick={() => { setIsLoading(true); const frame = document.getElementById("crypto-board") as HTMLIFrameElement | null; if (frame) frame.src = src; }}>
            <RefreshCw className="h-4 w-4 mr-2" /> Làm mới
          </Button>
          <Button size="sm" variant="outline" className="border-border" asChild>
            <a href={src} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-2" /> Mở tab mới</a>
          </Button>
        </div>

        {/* OKX Referral Banner */}
        <a
          href="https://www.okx.com/join/HOTSTOCKVN"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6 rounded-2xl p-5 sm:p-6 overflow-hidden border border-[rgba(112,66,225,0.35)] dark:border-[rgba(160,132,251,0.5)] bg-gradient-to-r from-[#1a0533]/90 via-[#2d0b5c]/90 to-[#1a0533]/90 dark:from-[#0e0020] dark:via-[#1a0040] dark:to-[#0e0020] shadow-[0_4px_24px_rgba(112,66,225,0.25)] hover:shadow-[0_8px_40px_rgba(112,66,225,0.45)] transition-all duration-300 hover:-translate-y-0.5 no-underline"
        >
          {/* Glow bg */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(160,132,251,0.18),transparent_60%)] pointer-events-none" />

          {/* Left: icon + text */}
          <div className="relative flex items-center gap-4 flex-1">
            {/* OKX Logo placeholder */}
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-[0_0_16px_rgba(160,132,251,0.4)]">
              <span className="text-white font-black text-lg tracking-tight">OKX</span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-bold text-base sm:text-lg leading-tight">Mở tài khoản OKX ngay</span>
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">Miễn phí</span>
              </div>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                Giao dịch <span className="text-yellow-300 font-semibold">Vàng · Bạc · Crypto</span> trên nền tảng hàng đầu thế giới. Ưu đãi phí giao dịch dành riêng cho thành viên HotStock.
              </p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[11px] text-white/60"><span className="text-green-400">✓</span> 600+ cặp giao dịch</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-white/60"><span className="text-green-400">✓</span> Phí thấp nhất thị trường</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-white/60"><span className="text-green-400">✓</span> Bảo mật tài sản cao</span>
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="relative flex-shrink-0">
            <span className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-[#7042E1] to-[#A084FB] text-white shadow-[0_4px_20px_rgba(112,66,225,0.5)] group-hover:shadow-[0_6px_28px_rgba(112,66,225,0.7)] group-hover:scale-105 transition-all duration-200 whitespace-nowrap">
              Đăng ký ngay
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </span>
          </div>
        </a>

        {/* Marquee giá coin (CoinGecko) - hiển thị trần, không khung */}
        <Script src="https://widgets.coingecko.com/gecko-coin-price-marquee-widget.js" strategy="afterInteractive" />
        <div
          style={{ width: '100%' }}
          dangerouslySetInnerHTML={{
            __html: '<gecko-coin-price-marquee-widget locale="en" outlined="true" coin-ids="bitcoin,ethereum,tether,binancecoin,solana,ripple,dogecoin,shiba-inu,toncoin,cardano" initial-currency="usd"></gecko-coin-price-marquee-widget>'
          }}
        />

        {/* Iframe container with gradient frame */}
        <div ref={wrapRef} className={`relative rounded-[28px] transition-all`}>
          <Card className="rounded-[26px] border border-[rgba(112,66,225,0.3)] dark:border-[rgba(160,132,251,0.6)] bg-card/60 dark:bg-[rgba(255,255,255,0.05)] backdrop-blur-md px-4 py-4 shadow-[0_0_10px_rgba(112,66,225,0.2)] dark:shadow-[0_0_15px_rgba(160,132,251,0.4)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(112,66,225,0.3)] dark:hover:shadow-[0_0_25px_rgba(160,132,251,0.7)] overflow-hidden bg-card border border-border">
            <CardContent className="p-0">
              {/* Loader overlay */}
              {isLoading && (
                <div className="absolute inset-0 z-10 grid place-items-center bg-background/70 backdrop-blur-sm">
                  <div className="w-full max-w-[720px] px-8">
                    <Skeleton className="h-8 w-1/3 mb-4" />
                    <Skeleton className="h-[44vh] md:h-[54vh] rounded-xl" />
                  </div>
                </div>
              )}
              <iframe
                id="crypto-board"
                src={inView ? src : undefined}
                title="market quotes TradingView widget"
                onLoad={() => setIsLoading(false)}
                className={`w-full h-[50vh] rounded-[26px] bg-card`}
                allow="clipboard-read; clipboard-write; fullscreen; geolocation; camera; microphone; display-capture; autoplay; allow-same-origin"
                referrerPolicy="no-referrer-when-downgrade"
                loading="lazy"
                sandbox="allow-scripts allow-popups allow-forms; allow-same-origin"
                scrolling="no"
              />
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
}

