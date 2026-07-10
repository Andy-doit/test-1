"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, ExternalLink } from "lucide-react";
import { MARKET_SOURCES } from "../sources";

export default function VietnamStockPage() {
  const [isLoading, setIsLoading] = useState(true);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  const src = MARKET_SOURCES.STOCK_VN;

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative  py-25  overflow-hidden">
      {/* Background: use global theme background; remove fixed white overlays */}

      <div className="relative max-w-[1600px] mx-auto px-4 md:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:gap-4">
          <div className="inline-flex items-center gap-2">
            <Badge className="bg-gradient-to-tr from-[#5C278B] to-[#A084FB] text-white">Realtime</Badge>
            <Badge variant="outline" className="border-[#7042E1]/30 text-[#7042E1]">VN-Index</Badge>
            <Badge variant="outline" className="border-[#7042E1]/30 text-[#7042E1]">HNX | UPCoM</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] bg-gradient-to-tr from-[#5C278B] to-[#A084FB] bg-clip-text leading-relaxed text-transparent">Bảng Giá Chứng Khoán Việt Nam</h1>
          <p className="text-foreground/70 max-w-2xl">Theo dõi realtime chỉ số, khối lượng, giao dịch khối ngoại và nhiều hơn nữa. Dưới đây là bảng điện từ đối tác được nhúng trực tiếp để bạn giao dịch và quan sát tức thời.</p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="border-border" onClick={() => { setIsLoading(true); const frame = document.getElementById("vn-board") as HTMLIFrameElement | null; if (frame) frame.src = src; }}>
            <RefreshCw className="h-4 w-4 mr-2" /> Làm mới
          </Button>
          <Button size="sm" variant="outline" className="border-border" asChild>
            <a href={src} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-2" /> Mở tab mới</a>
          </Button>
        </div>

        {/* Iframe container with gradient frame */}
        <div ref={wrapperRef} className={`relative rounded-[28px]  transition-all`}>
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
                id="vn-board"
                src={inView ? src : undefined}
                title="Vietnam Stock Board"
                onLoad={() => setIsLoading(false)}
                className={`w-full h-[82vh] md:h-[86vh] rounded-[26px] bg-card`}
                allow="clipboard-read; clipboard-write; fullscreen; geolocation; camera; microphone; display-capture; autoplay; allow-same-origin"
                referrerPolicy="no-referrer-when-downgrade"
                loading="lazy"
                sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

