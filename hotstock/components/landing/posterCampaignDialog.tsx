"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export type PosterDialogKey = 1 | 2 | 3;

export const posterDialogContent: Record<
  PosterDialogKey,
  {
    title: string;
    subtitle: string;
    highlight: string;
    bullets: string[];
    targetLabel: string;
  }
> = {
  1: {
    title: "SIÊU ƯU ĐÃI MARGIN – LÃI SUẤT CHỈ 8–9.29%",
    subtitle: "Bứt phá danh mục với chi phí vốn thấp hơn đáng kể so với mặt bằng chung thị trường.",
    highlight:
      "Gói margin được thiết kế cho nhà đầu tư muốn tăng tốc trong chu kỳ tăng trưởng nhưng vẫn ưu tiên sự an toàn tài chính.",
    bullets: [
      "Lãi suất thấp – ổn định, giúp giảm đáng kể áp lực chi phí sử dụng đòn bẩy.",
      "Phê duyệt nhanh, giải ngân tức thì để không bỏ lỡ các nhịp thị trường quan trọng.",
      "Tối ưu vòng quay vốn, hỗ trợ gia tăng lợi nhuận trong các nhịp tăng mạnh.",
    ],
    targetLabel:
      "Phù hợp với nhà đầu tư muốn tận dụng cơ hội thị trường nhưng vẫn ưu tiên mức phí hợp lý và quản trị rủi ro chặt chẽ.",
  },
  2: {
    title: "SẢN PHẨM ĐẶC BIỆT – HIGHT MARGIN",
    subtitle:
      '"Hight Margin" (High Margin) là sản phẩm nâng cấp, cho phép tiếp cận mức đòn bẩy cao hơn so với margin truyền thống.',
    highlight:
      "Tối ưu sức mua, mở rộng quy mô vị thế khi thị trường bước vào giai đoạn bứt phá với nhiều cơ hội.",
    bullets: [
      "Tỷ lệ cấp margin vượt trội, tối ưu sức mua gấp nhiều lần so với thông thường.",
      "Danh mục hỗ trợ rộng, tập trung nhóm ngành có tính dẫn dắt và thanh khoản tốt.",
      "Có sự đồng hành từ chuyên gia, đưa ra khuyến nghị hợp lý, kịp thời theo diễn biến thị trường.",
      "Phù hợp trong giai đoạn thị trường tăng mạnh, nơi đòn bẩy cao tạo ra lợi thế cạnh tranh lớn.",
    ],
    targetLabel:
      "Dành cho nhà đầu tư có kinh nghiệm, muốn tối ưu hóa hiệu suất vốn và chủ động chớp cơ hội trong các nhịp tăng mạnh.",
  },
  3: {
    title: "HOA HỒNG CỘNG TÁC VIÊN MÔI GIỚI – LÊN ĐẾN 70%",
    subtitle:
      "Xây dựng dòng thu nhập bền vững trong ngành tài chính – chứng khoán mà không cần vốn, không cần kinh nghiệm ban đầu.",
    highlight:
      "Chương trình CTV môi giới với hoa hồng lên đến 70%, đi kèm hệ thống đào tạo – công cụ – nền tảng hỗ trợ toàn diện.",
    bullets: [
      "Hoa hồng hấp dẫn, lên đến 70% cho mỗi giao dịch của khách hàng – mức cạnh tranh hàng đầu thị trường.",
      "Được hỗ trợ đầy đủ tài liệu, công cụ và nền tảng giao dịch để tư vấn và chăm sóc khách hàng.",
      "Đào tạo 1:1 về kiến thức thị trường, kỹ năng tư vấn và quy trình mở tài khoản.",
      "Không cần văn phòng, không ràng buộc KPI – linh hoạt thời gian và cách thức làm việc.",
      "Hệ thống công nghệ giúp theo dõi khách hàng, quản lý doanh thu minh bạch, rõ ràng.",
    ],
    targetLabel:
      "Phù hợp với người muốn tìm thêm thu nhập, có mạng lưới quan hệ tốt hoặc muốn bắt đầu hành trình trở thành môi giới chuyên nghiệp.",
  },
};

interface PosterCampaignDialogProps {
  openPoster: PosterDialogKey | null;
  setOpenPoster: (value: PosterDialogKey | null) => void;
}

export function PosterCampaignDialog({
  openPoster,
  setOpenPoster,
}: PosterCampaignDialogProps) {
  return (
    <Dialog open={openPoster !== null} onOpenChange={(open) => !open && setOpenPoster(null)}>
      <DialogContent className="max-w-3xl sm:max-w-4xl border border-white/10 bg-gradient-to-br from-[#050509] via-[#070317] to-[#140b2e] text-white shadow-[0_40px_140px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* glow background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 -right-10 h-56 w-56 rounded-full bg-[#a855f7]/25 blur-3xl" />
          <div className="absolute bottom-[-80px] left-[-40px] h-60 w-60 rounded-full bg-[#22d3ee]/22 blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        </div>
        {openPoster && (
          <div className="relative space-y-5 sm:space-y-7">
            {/* Header + intro */}
            <div className="space-y-3 sm:space-y-4">
              <DialogHeader className="space-y-3 pb-1">
                <DialogTitle className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] text-[#a5b4fc]/90 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#a855f7]/18 text-[11px] text-[#D7FE02] border border-[#a855f7]/45">
                    {openPoster}
                  </span>
                  ƯU ĐÃI ĐỘC QUYỀN HOTSTOCK
                </DialogTitle>
                <div className="space-y-2">
                  <p className="text-2xl sm:text-3xl font-bold leading-snug">
                    <span className="bg-gradient-to-r from-white via-white to-[#c4b5fd] bg-clip-text text-transparent">
                      {posterDialogContent[openPoster].title}
                    </span>
                  </p>
                  <DialogDescription className="text-sm sm:text-base text-white/82 leading-relaxed">
                    {posterDialogContent[openPoster].subtitle}
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-r from-white/10 via-white/6 to-transparent px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base text-white/92 leading-relaxed shadow-[0_18px_60px_rgba(15,23,42,0.75)]">
                <div className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-gradient-to-b from-[#D7FE02] via-[#a855f7] to-[#22d3ee]" />
                <div className="pl-3 sm:pl-4">
                  {posterDialogContent[openPoster].highlight}
                </div>
              </div>
            </div>

            {/* Body content */}
            <div className="space-y-5 sm:space-y-6">
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60 flex items-center gap-2">
                  <span className="inline-block h-px w-6 bg-gradient-to-r from-white/10 via-white/40 to-white/10" />
                  Điểm nổi bật
                </p>
                <ul className="space-y-2.5 text-sm sm:text-base text-white/85">
                  {posterDialogContent[openPoster].bullets.map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#22c55e]/12 text-[11px] text-[#bbf7d0] border border-[#22c55e]/40 shadow-[0_0_12px_rgba(34,197,94,0.55)]">
                        ✓
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

               <div className="pt-1 space-y-3 pb-1 border-t border-white/8 mt-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60 flex items-center gap-2">
                  <span className="inline-block h-px w-6 bg-gradient-to-r from-white/10 via-white/40 to-white/10" />
                  Dành cho ai?
                </p>
                <p className="text-sm sm:text-base text-white/88 leading-relaxed">
                  {posterDialogContent[openPoster].targetLabel}
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

 
