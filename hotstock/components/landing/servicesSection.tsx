"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";

export function ServicesSection() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="py-8 sm:py-12 md:py-16 max-w-[1600px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="text-center mb-6 sm:mb-8 md:mb-10">
        {/* Badge - White background, black text */}
        <div className="inline-block rounded-full px-4 py-3 sm:px-6 sm:py-3 bg-white dark:bg-white mb-4">
          <span className="text-lg font-medium text-black dark:text-black">Dịch vụ của HotStock</span>
        </div>
        {/* Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-relaxed font-bold text-black dark:text-white">
          Cung cấp giải pháp đầu tư <span className="text-purple-600 dark:text-purple-200">toàn diện</span>
        </h2>
      </div>

      {/* Three Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Panel 1 - Thông Tin */}
        <Link
          href="/phan-tich/economic"
          className="relative rounded-2xl border border-gray-300 dark:border-gray-800 p-6 sm:p-8 overflow-hidden group hover:border-purple-500/50 transition-all duration-300 min-h-[200px] sm:min-h-[250px] flex items-center justify-center cursor-pointer"
          style={{
            backgroundImage: 'url(/homePage/h1.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50 group-hover:bg-black/20 dark:group-hover:bg-black/40 transition-all duration-300" />
          {/* Text */}
          <h3 className="text-2xl sm:text-4xl text-white relative z-10">Thông Tin</h3>
        </Link>

        {/* Panel 2 - Phân Tích */}
        <Link
          href="/phan-tich/business"
          className="relative rounded-2xl border border-gray-300 dark:border-gray-800 p-6 sm:p-8 overflow-hidden group hover:border-purple-500/50 transition-all duration-300 min-h-[200px] sm:min-h-[250px] flex items-center justify-center cursor-pointer"
          style={{
            backgroundImage: 'url(/homePage/h2.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50 group-hover:bg-black/20 dark:group-hover:bg-black/40 transition-all duration-300" />
          {/* Text */}
          <h3 className="text-2xl sm:text-4xl text-white relative z-10">Phân Tích</h3>
        </Link>

        {/* Panel 3 - Chiến Lược */}
        <Link
          href={isAuthenticated ? "/phan-tich" : "/register"}
          className="relative rounded-2xl border border-gray-300 dark:border-gray-800 p-6 sm:p-8 overflow-hidden group hover:border-purple-500/50 transition-all duration-300 min-h-[200px] sm:min-h-[250px] flex items-center justify-center cursor-pointer"
          style={{
            backgroundImage: 'url(/homePage/h3.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50 group-hover:bg-black/20 dark:group-hover:bg-black/40 transition-all duration-300" />
          {/* Text */}
          <h3 className="text-2xl sm:text-4xl text-white relative z-10">Chiến Lược</h3>
        </Link>
      </div>
    </div>
  );
}
