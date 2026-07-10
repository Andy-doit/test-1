"use client";

import Link from "next/link";
import Image from "next/image";

export default function ZaloFloatingButton() {
  const zaloUrl = "https://zalo.me/g/uthqna256"
  return (
    <div className="fixed bottom-6 right-6 z-[60] pointer-events-none select-none">
      {/* subtle pulse halo */}
      <span className="absolute inset-0 -z-10 rounded-full bg-[#8B5CF6]/25 animate-ping" />
      {/* bouncing button */}
      <Link
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat Zalo"
        className="pointer-events-auto inline-flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-[#5C278B] to-[#A084FB] text-white shadow-[0_10px_30px_rgba(112,66,225,0.35)] hover:shadow-[0_16px_40px_rgba(112,66,225,0.45)] hover:scale-105 active:scale-95 transition-all animate-bounce relative"
      >
        <Image src="/zalo.svg" alt="Zalo" width={48} height={48} priority className="drop-shadow rounded-full" />
        {/* online dot */}
        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500/40 animate-ping" />
      </Link>
    </div>
  );
}


