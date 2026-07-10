

import { Metadata } from "next";
import { MARKET_SOURCES } from "./sources";

export const metadata: Metadata = {
  title: "Tổng hợp thị trường",
  description: "Theo dõi Crypto, Ngoại hối, Giá vàng và Bảng giá chứng khoán Việt Nam trong một màn hình duy nhất.",
};

export default function MarketPage() {
  const { CRYPTO, FX, GOLD,  STOCK_VN } = MARKET_SOURCES;

  return (
    <section className="relative min-h-[100vh] overflow-hidden py-25">
      {/* Background handled by UserBackground component */}


      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight" style={{ color: 'var(--title)' }}>Tổng hợp thị trường</h1>
          <p className="mt-3 text-foreground/70">Crypto, Ngoại hối, Giá vàng bao quanh Bảng giá VN để theo dõi nhanh trong một màn hình.</p>
        </header>

        {/* Layout: top row FX/GOLD equal; bottom row VN large + Crypto tall */}
        <div className="grid grid-cols-1 lg:grid-cols-12 auto-rows-[minmax(200px,auto)] gap-6">
          {/* Top left: FX */}
          <section className="relative rounded-2xl border border-[rgba(112,66,225,0.3)] dark:border-[rgba(160,132,251,0.6)] bg-card/60 dark:bg-[rgba(255,255,255,0.05)] backdrop-blur-md px-4 py-4 shadow-[0_0_10px_rgba(112,66,225,0.2)] dark:shadow-[0_0_15px_rgba(160,132,251,0.4)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(112,66,225,0.3)] dark:hover:shadow-[0_0_25px_rgba(160,132,251,0.7)] lg:col-span-6">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
              <h2 className="font-semibold text-foreground">Tỉ giá ngoại tệ</h2>
              <a href="/thi-truong/forexRates" className="text-[12px] text-[color:var(--title)]">Xem chi tiết</a>
            </div>
            <div className="relative mt-5">
              <iframe title="FX Cross Rates" src={FX} className="w-full rounded-[20px] h-[240px] " loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </section>

          {/* Top right: GOLD */}
          <section className="relative rounded-2xl border border-[rgba(112,66,225,0.3)] dark:border-[rgba(160,132,251,0.6)] bg-card/60 dark:bg-[rgba(255,255,255,0.05)] backdrop-blur-md px-4 py-4 shadow-[0_0_10px_rgba(112,66,225,0.2)] dark:shadow-[0_0_15px_rgba(160,132,251,0.4)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(112,66,225,0.3)] dark:hover:shadow-[0_0_25px_rgba(160,132,251,0.7)] overflow-hidden lg:col-span-6">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
              <h2 className="font-semibold text-foreground">Giá vàng</h2>
              <a href="/thi-truong/goldPrice" className="text-[12px] text-[color:var(--title)]">Xem chi tiết</a>
            </div>
            <div className="relative mt-5">
              <iframe title="Gold Price" src={GOLD} className="w-full rounded-[20px] h-[240px] " loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </section>

          {/* Bottom left: VN Stocks (large) */}
          <section className="relative rounded-2xl border border-[rgba(112,66,225,0.3)] dark:border-[rgba(160,132,251,0.6)] bg-card/60 dark:bg-[rgba(255,255,255,0.05)] backdrop-blur-md px-4 py-4 shadow-[0_0_10px_rgba(112,66,225,0.2)] dark:shadow-[0_0_15px_rgba(160,132,251,0.4)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(112,66,225,0.3)] dark:hover:shadow-[0_0_25px_rgba(160,132,251,0.7)] overflow-hidden lg:col-span-8">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
              <h2 className="font-semibold text-foreground">Chứng khoán Việt Nam</h2>
              <a href="/thi-truong/stockVN" className="text-[12px] text-[color:var(--title)]">Xem chi tiết</a>
            </div>
            <div className="relative mt-5">
              <iframe title="Vietnam Stock Board" src={STOCK_VN} className="w-full rounded-[20px] h-[520px] " loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </section>

          {/* Bottom right: Crypto (tall) */}
          <section className="relative rounded-2xl border border-[rgba(112,66,225,0.3)] dark:border-[rgba(160,132,251,0.6)] bg-card/60 dark:bg-[rgba(255,255,255,0.05)] backdrop-blur-md px-4 py-4 shadow-[0_0_10px_rgba(112,66,225,0.2)] dark:shadow-[0_0_15px_rgba(160,132,251,0.4)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(112,66,225,0.3)] dark:hover:shadow-[0_0_25px_rgba(160,132,251,0.7)] overflow-hidden lg:col-span-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-foreground">Crypto</h2>
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-500/40">🥇 Vàng</span>
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-500/40">🪙 Bạc</span>
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40">₿ Crypto</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <a href="/thi-truong/cryptoBitcoin" className="text-[12px] text-[color:var(--title)]">Xem chi tiết</a>
                <a
                  href="https://www.okx.com/join/HOTSTOCKVN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold bg-gradient-to-r from-[#7042E1] to-[#A084FB] text-white shadow-[0_2px_10px_rgba(112,66,225,0.35)] hover:shadow-[0_4px_16px_rgba(112,66,225,0.5)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" /></svg>
                  Mở TK OKX
                </a>
              </div>
            </div>
            <div className="relative mt-5">
              <iframe title="Crypto Quotes" src={CRYPTO} className="w-full rounded-[20px] h-[520px] " loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
