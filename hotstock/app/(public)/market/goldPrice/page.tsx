"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, ExternalLink, MapPin } from "lucide-react";
import { goldVendors } from "@/data/mockData";
import { MARKET_SOURCES } from "../sources";

export default function GoldPricePage() {
  const [isLoading, setIsLoading] = useState(true);
  const frameWrapRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const src = MARKET_SOURCES.GOLD;

  useEffect(() => {
    const el = frameWrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setInView(true); io.disconnect(); }
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);


  return (
    <section className="relative  py-25  overflow-hidden">
      {/* Background: dùng nền global theo theme, bỏ overlay trắng */}

      <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="inline-flex items-center gap-2">
            <Badge className="bg-gradient-to-tr from-[#5C278B] to-[#A084FB] text-white">Realtime</Badge>
            <Badge variant="outline" className="border-[#7042E1]/30 text-[#7042E1]">Gold</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] bg-gradient-to-tr from-[#5C278B] to-[#A084FB] bg-clip-text leading-relaxed text-transparent">Giá Vàng Thế Giới</h1>
          <p className="text-foreground/70 max-w-2xl">Biểu đồ giá vàng realtime theo giờ (khung H1) từ Investing.com. Dùng để quan sát xu hướng và mức biến động ngắn hạn.</p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="border-border" onClick={() => { setIsLoading(true); const frame = document.getElementById("gold-board") as HTMLIFrameElement | null; if (frame) frame.src = src; }}>
            <RefreshCw className="h-4 w-4 mr-2" /> Làm mới
          </Button>
          <Button size="sm" variant="outline" className="border-border" asChild>
            <a href={src} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-2" /> Mở tab mới</a>
          </Button>
        </div>

        {/* Iframe container with gradient frame */}
        <div ref={frameWrapRef} className={`relative rounded-[28px] transition-all`}>
          <Card className="rounded-[26px] overflow-hidden border border-[rgba(112,66,225,0.3)] dark:border-[rgba(160,132,251,0.6)] bg-card/60 dark:bg-[rgba(255,255,255,0.05)] backdrop-blur-md px-4 py-4 shadow-[0_0_10px_rgba(112,66,225,0.2)] dark:shadow-[0_0_15px_rgba(160,132,251,0.4)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(112,66,225,0.3)] dark:hover:shadow-[0_0_25px_rgba(160,132,251,0.7)]">
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
                id="gold-board"
                src={inView ? src : undefined}
                title="Gold Price Investing.com"
                onLoad={() => setIsLoading(false)}
                className={`w-full h-[65vh]  rounded-[26px] bg-card`}
                allow="clipboard-read; clipboard-write; fullscreen; geolocation; camera; microphone; display-capture; autoplay; allow-same-origin"
                referrerPolicy="no-referrer-when-downgrade"
                loading="lazy"
                sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
                scrolling="no"
              />
            </CardContent>
          </Card>
        </div>

        {/* Địa chỉ mua vàng uy tín */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-tr from-[#5C278B] to-[#A084FB] bg-clip-text text-transparent">Địa chỉ mua vàng uy tín</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {goldVendors.flatMap((v) => (
              v.items.map((it, idx) => (
                <div key={`${v.brand}-${idx}`} className="relative rounded-[22px] p-[2px] bg-gradient-to-tr from-[#A084FB]/50 to-[#7042E1]/40 shadow-[0_18px_70px_rgba(112,66,225,0.12)]">
                  <Card className="rounded-[20px] overflow-hidden bg-card border border-border h-full group">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-border">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-[color:var(--title)] mt-0.5" />
                          <div>
                            <div className="text-sm text-[color:var(--title)] font-semibold">{v.brand}</div>
                            <div className="text-foreground font-medium max-w-[520px]">{it.address}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(it.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 rounded-full border border-[#7042E1]/30 text-[#7042E1] hover:text-white hover:bg-gradient-to-tr hover:from-[#7042E1] hover:to-[#A084FB] transition"
                          >
                            Mở Google Maps
                          </a>
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(it.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 rounded-full border border-border text-foreground hover:bg-accent"
                          >
                            Chỉ đường
                          </a>
                        </div>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="h-[300px] md:h-[340px] overflow-hidden">
                          <iframe
                            title={`${v.brand} - ${idx}`}
                            src={`https://www.google.com/maps?q=${encodeURIComponent(it.address)}&output=embed`}
                            className="w-full h-full transition-transform duration-500 group-hover:scale-[1.03]"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}


