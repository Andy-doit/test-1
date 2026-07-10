"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import type { PosterDialogKey } from "./posterCampaignDialog";

const PosterCampaignDialog = dynamic(
  () => import("./posterCampaignDialog").then((mod) => mod.PosterCampaignDialog),
  { ssr: false }
);

export function HeroSection() {
  const [activeTab, setActiveTab] = useState<number>(2);
  const [openPoster, setOpenPoster] = useState<PosterDialogKey | null>(null);

  const posterCampaigns = [
    "/homePage/poster1.png",
    "/homePage/poster2.png",
    "/homePage/poster3.png",
  ];

  return (
    <>
      {/* HERO (match screenshot) - Centered orb with sidebars */}
      <div className="relative flex items-center justify-center">
        <div className="relative z-10 flex flex-col py-30 items-center justify-center max-w-7xl mx-auto">
          {/* Large Orb Background with bubble.svg */}
          <div className="relative w-full flex items-center justify-center">
            {/* Bubble SVG - background layer */}
            <div className="absolute inset-0 blur-[1px] flex items-center justify-center -inset-[20%] sm:-inset-[15%] md:-inset-[10%]">
              <Image
                src="/homePage/bubble.svg"
                alt=""
                width={2000}
                height={2000}
                className="w-full h-full object-contain blur-[1px] dark:opacity-100 opacity-30"
                priority
                style={{
                  minWidth: '140%',
                  minHeight: '140%',
                  filter: 'brightness(0.7)',
                }}
              />
            </div>

            {/* Inner content - positioned absolutely over bubble */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="text-center space-y-3 sm:space-y-4 md:space-y-5 px-4 sm:px-6 md:px-8 lg:px-12">
                {/* Animated market floating badge */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-white/90 dark:bg-white/10 backdrop-blur-md border border-purple-200 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 shadow-[0_2px_12px_rgba(112,66,225,0.2)] animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping inline-block" style={{ animationDuration: '1.5s' }}></span>
                    Live · Chứng khoán · Vàng · Crypto
                  </span>
                </div>
                {/* Small HOTSTOCK text at top */}
                <h1 className="text-sm sm:text-base md:text-xl font-medium text-purple-600 dark:text-white drop-shadow-[0_0_6px_rgba(160,132,251,0.4)]">
                  HOTSTOCK
                </h1>
                {/* Large headline with gradient - matching image style */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                  <span className="block">
                    <span className="text-black dark:text-white">Thấu hiểu </span>
                    <span className="text-purple-600 dark:text-purple-200">biến động</span>
                  </span>
                  <span className="leading-relaxed mt-1">
                    <span className="text-purple-600 dark:text-purple-200">Từng nhịp </span>
                    <span className="text-black dark:text-white">thị trường</span>
                  </span>
                </h2>
                {/* Subtitle - smaller */}
                <p className="text-lg sm:text-lg text-black/80 dark:text-white/90 drop-shadow-[0_0_4px_rgba(160,132,251,0.3)] mt-2 sm:mt-3 font-normal">
                  Smart Capital Meets Growth
                </p>
                {/* CTA Buttons */}
                <div className="pt-3 sm:pt-4 md:pt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/thi-truong"
                    className="inline-flex items-center gap-2 rounded-full px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-black dark:text-white transition-all duration-300 border-2 border-purple-600 dark:border-white/40 backdrop-blur-md bg-white/80 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 hover:border-purple-700 dark:hover:border-white/60"
                  >
                    Khám phá ngay
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="https://www.okx.com/join/HOTSTOCKVN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white transition-all duration-300 bg-gradient-to-r from-[#7042E1] to-[#A084FB] shadow-[0_4px_20px_rgba(112,66,225,0.45)] hover:shadow-[0_6px_30px_rgba(112,66,225,0.65)] hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-1-7.5v-5l4.5 2.5-4.5 2.5z" /></svg>
                    Mở TK Crypto OKX
                  </Link>
                </div>
                {/* Market stats mini-row */}
                <div className="pt-4 flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs text-black/60 dark:text-white/60">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    <span className="font-medium text-black/80 dark:text-white/80">Vàng</span> · SJC
                  </span>
                  <span className="text-black/20 dark:text-white/20 hidden sm:inline">|</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-black/60 dark:text-white/60">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span className="font-medium text-black/80 dark:text-white/80">Crypto</span> · BTC · ETH
                  </span>
                  <span className="text-black/20 dark:text-white/20 hidden sm:inline">|</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-black/60 dark:text-white/60">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="font-medium text-black/80 dark:text-white/80">Ngoại tệ</span> · USD · EUR
                  </span>
                  <span className="text-black/20 dark:text-white/20 hidden sm:inline">|</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-black/60 dark:text-white/60">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    <span className="font-medium text-black/80 dark:text-white/80">CK Việt Nam</span> · VN-Index
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 sm:py-12 md:py-16 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="flex flex-row items-stretch gap-2 sm:gap-3 md:gap-4">
          {/* Left Panel - Decorative */}
          <div className="flex-1 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-2 items-center justify-center text-black dark:text-white hidden md:flex">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#7042E1] to-[#A084FB] flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                1
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-300 text-gray-400 dark:border-white/30 dark:text-white/50 font-semibold text-sm sm:text-base flex items-center justify-center">
                2
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-300 text-gray-400 dark:border-white/30 dark:text-white/50 font-semibold text-sm sm:text-base flex items-center justify-center">
                3
              </div>
            </div>
          </div>

          {/* Center Panel - Active Content */}
          <div className="flex-[5] rounded-2xl bg-gradient-to-r from-[#7042E1] to-[#A084FB] p-6">
            <div className="flex flex-row items-start gap-4 sm:gap-6">
              {/* Tab Indicators */}
              <div className="flex gap-2 sm:gap-3 flex-shrink-0">
                <button
                  onClick={() => setActiveTab(1)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-base sm:text-lg transition-all ${activeTab === 1
                    ? 'bg-black text-white'
                    : 'border-2 border-white/80 text-white dark:border-white text-white'
                    }`}
                >
                  1
                </button>
                <button
                  onClick={() => setActiveTab(2)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg transition-all ${activeTab === 2
                    ? 'bg-black text-white'
                    : 'border-2 border-white text-white'
                    }`}
                >
                  2
                </button>
                <button
                  onClick={() => setActiveTab(3)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold text-base sm:text-lg transition-all ${activeTab === 3
                    ? 'bg-black text-white'
                    : 'border-2 border-white text-white'
                    }`}
                >
                  3
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 text-black dark:text-white">
                <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                  {activeTab === 1 && "HotStock là nền tảng tài chính toàn diện — nơi phân tích dữ liệu và hội tụ đa thị trường trong một trải nghiệm trực quan, mượt mà với thời gian thực."}
                  {activeTab === 2 && "Đội ngũ tư vấn giàu kinh nghiệm luôn sẵn sàng cung cấp góc nhìn chiến lược, cập nhật thị trường nhanh và hỗ trợ nhà đầu tư quyết định hiệu quả."}
                  {activeTab === 3 && "Với HotStock, bạn không chỉ xem thị trường – bạn cảm nhận được cách thị trường đang vận hành."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Decorative */}
          <div className="flex-1 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-2 items-center justify-center text-black dark:text-white hidden md:flex">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-300 text-gray-400 dark:border-white/30 dark:text-white/50 font-semibold text-sm sm:text-base flex items-center justify-center">
                1
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-300 text-gray-400 dark:border-white/30 dark:text-white/50 font-semibold text-sm sm:text-base flex items-center justify-center">
                2
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#7042E1] to-[#A084FB] flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                3
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Poster Campaign Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="flex items-center md:items-center justify-center gap-6 mb-8 sm:mb-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto md:mx-0">
              <Link
                href="https://zalo.me/g/uthqna256"
                target="_blank"
                className="inline-block rounded-full px-4 py-3 sm:px-6 sm:py-3 bg-white dark:bg-white mb-4"
              >
                <span className="text-lg font-medium text-black dark:text-black">Tham gia cùng HotStock</span>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {posterCampaigns.map((src, index) => {
              const key = (index + 1) as PosterDialogKey;
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => setOpenPoster(key)}
                  className="group relative overflow-hidden rounded-[30px] border border-gray-200 dark:border-white/10 bg-white dark:bg-[#050509]/80 shadow-[0_25px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.45)] aspect-[3/5] min-h-[420px] md:min-h-[560px] xl:min-h-[720px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Image
                    src={src}
                    alt="HotStock poster"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover w-full h-full transition duration-700 group-hover:scale-105"
                    priority={false}
                  />
                  <div className="absolute inset-0 border border-white/10 rounded-[30px] pointer-events-none" />
                </button>
              );
            })}
          </div>
        </div>
      </section>
      <PosterCampaignDialog
        openPoster={openPoster}
        setOpenPoster={setOpenPoster}
      />
    </>
  );
}
