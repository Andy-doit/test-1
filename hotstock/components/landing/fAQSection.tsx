"use client";

import React, { useState } from "react";
import { faqs } from "@/data/mockData";

export function FAQSection() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const faqSplitIndex = Math.ceil(faqs.length / 2);
  const faqColumns = [faqs.slice(0, faqSplitIndex), faqs.slice(faqSplitIndex)];

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6">
        <div className="flex flex-col items-center text-center gap-3 mb-8 sm:mb-10">
          <div className="inline-block rounded-full px-4 py-3 sm:px-6 sm:py-3 bg-white dark:bg-white mb-4">
            <span className="text-lg font-medium text-black dark:text-black">
              Câu hỏi thường gặp
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-relaxed font-bold text-black dark:text-white">
            <span className="text-purple-600 dark:text-purple-200">Giải đáp nhanh</span> các thắc mắc về nền tảng,<br /> dữ liệu và gói hội viên.
          </h2>
        </div>

        <div className="grid gap-3 md:gap-4 md:grid-cols-2">
          {faqColumns.map((column, columnIdx) => (
            <div key={columnIdx} className="space-y-3">
              {column.map((item, itemIdx) => {
                const globalIndex = columnIdx === 0 ? itemIdx : faqSplitIndex + itemIdx;
                const isOpen = faqOpen === globalIndex;
                return (
                  <div
                    key={item.q}
                    className="rounded-2xl border border-gray-200 dark:border-white/40 px-5 sm:px-6 py-3 sm:py-4 text-black dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-white/25 bg-white/80 dark:bg-transparent"
                  >
                    <button
                      onClick={() => setFaqOpen(isOpen ? null : globalIndex)}
                      className="w-full flex items-center justify-between text-left gap-4"
                    >
                      <span className="text-base sm:text-lg font-medium text-black dark:text-white/90">{item.q}</span>
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 border border-gray-200 text-black dark:bg-white/5 dark:border-white/10 dark:text-white transition-transform ${isOpen ? 'rotate-180' : ''
                          }`}
                      >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                          <path fillRule="evenodd" d="M5.25 7.75L10 12.5l4.75-4.75" clipRule="evenodd" />
                        </svg>
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pt-3 text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
