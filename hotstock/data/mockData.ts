import type { EconomicEvent } from "@/types/iReport";

// Economic Calendar Data
export const ECONOMIC_CALENDAR: EconomicEvent[] = [
  {
    id: "2025-11-17-jp",
    date: "2025-11-17",
    displayDate: "Thứ Hai, 17 tháng 11, 2025",
    isToday: true,
    events: [
      {
        time: "06:50 AM",
        country: "Nhật Bản",
        countryFlag: "🇯🇵",
        title: "Tăng trưởng GDP tính theo năm (Sơ bộ)",
        sectors: ["Bất động sản", "Dệt may"],
        summary:
          "GDP Nhật được kỳ vọng cải thiện trong Q3 nhờ nhu cầu nội địa, tuy nhiên xuất khẩu vẫn yếu.",
        impact: "Trung bình",
        actual: "-1.8%",
        previous: "2.3%",
      },
      {
        time: "06:50 AM",
        country: "Nhật Bản",
        countryFlag: "🇯🇵",
        title: "Tốc độ tăng trưởng GDP QoQ sơ bộ",
        sectors: ["Dệt may", "Bất động sản"],
        summary: "Số liệu GDP có thể ảnh hưởng đến nhu cầu nhập khẩu hàng hóa từ Việt Nam.",
        impact: "Trung bình",
        actual: "-0.4%",
        previous: "0.6%",
      },
    ],
  },
  {
    id: "2025-11-18-us",
    date: "2025-11-18",
    displayDate: "Thứ Ba, 18 tháng 11, 2025",
    events: [
      {
        time: "08:30 PM",
        country: "Hoa Kỳ",
        countryFlag: "🇺🇸",
        title: "Giá nhập khẩu MoM",
        sectors: ["Dệt may", "Hàng gia dụng"],
        summary: "Nếu giá nhập khẩu tăng mạnh hơn dự kiến, áp lực lạm phát có thể trở lại.",
        impact: "Thấp",
      },
      {
        time: "09:15 PM",
        country: "Hoa Kỳ",
        countryFlag: "🇺🇸",
        title: "Sản xuất công nghiệp theo tháng",
        sectors: ["Chất bán dẫn", "Năng lượng"],
        summary:
          "Số liệu sản xuất công nghiệp từ các nền kinh tế lớn là chỉ báo cho nhu cầu hàng hóa.",
        impact: "Trung bình",
      },
    ],
  },
];

// FAQ Data
export interface FAQItem {
  q: string;
  a: string;
}

export const faqs: FAQItem[] = [
  {
    q: "HotStock là gì và dành cho ai?",
    a: "HotStock là nền tảng chia sẻ kiến thức và chiến lược đầu tư chứng khoán dành cho người mới và nhà đầu tư muốn sinh lời an toàn. Chúng tôi cung cấp phân tích dễ hiểu, cập nhật thị trường nhanh chóng và các gợi ý đầu tư thực tế, giúp bạn tự tin xây dựng danh mục hiệu quả trong thị trường Việt Nam.",
  },
  {
    q: "Tôi có cần tài khoản để truy cập nội dung không?",
    a: "Bạn có thể xem một phần nội dung miễn phí, nhưng để sử dụng đầy đủ biểu đồ, cảnh báo và báo cáo, cần đăng ký tài khoản hội viên.",
  },
  
 
  {
    q: "Sự khác nhau giữa các gói Titan, Gold và Premium là gì?",
    a: "Titan cho người tự đầu tư bằng những tín hiệu uy tín, phân tích chuyên sâu,  Gold dành cho nhà đầu tư cần chiến lược linh hoạt và hỗ trợ sâu hơn, và Premium là cấp cao nhất với phân tích danh mục cá nhân hóa, cùng coaching 1–1.",
  },
  {
    q: "Tôi có thể nâng cấp hoặc hạ cấp gói hội viên bất cứ lúc nào không?",
    a: "Hoàn toàn được. Bạn có thể thay đổi gói hội viên trong phần \"Tài khoản\" chỉ với vài thao tác.",
  },
  {
    q: "HotStock có chương trình dùng thử miễn phí không?",
    a: "Có, join nhóm zalo cộng đồng Hotstock để nhận được nhiều thông tin bổ ích cho việc đầu tư chứng khoán.",
  },
  {
    q: "Làm sao để liên hệ với đội ngũ hỗ trợ HotStock?",
    a: "Bạn có thể gửi câu hỏi trực tiếp qua khung chat trên website, Zalo và nhiều nền tảng khác.",
  },
  {
    q: "Tôi quên mật khẩu, phải làm thế nào?",
    a: "Vào trang \"Đăng nhập\" → chọn \"Quên mật khẩu\" → nhập email để nhận liên kết đặt lại mật khẩu.",
  },
  {
    q: "HotStock có cung cấp tư vấn đầu tư cá nhân không?",
    a: "Có, hội viên Gold và Premium có thể được hỗ trợ tư vấn từ đội ngũ chuyên gia theo lịch hẹn riêng.",
  },
];

// Gold Vendors Data
export interface GoldVendorItem {
  address: string;
}

export interface GoldVendor {
  brand: string;
  items: GoldVendorItem[];
}

export const goldVendors: GoldVendor[] = [
  {
    brand: "Tiệm vàng Mi Hồng",
    items: [{ address: "306 Bùi Hữu Nghĩa, P.2, Q.Bình Thạnh, Tp. HCM (Chợ Bà Chiểu)." }],
  },
  {
    brand: "SJC",
    items: [
      { address: "418 – 420 Nguyễn Thị Minh Khai, Phường 5, Quận 3, TP. HCM" },
      { address: "196 Trần Hưng Đạo, P. Nguyễn Cư Trinh, Quận 1, TP. HCM" },
      { address: "172 Nguyễn Văn Nghi, Phường 5, Q. Gò Vấp, TP. HCM" },
    ],
  },
  {
    brand: "DOJI",
    items: [
      { address: "589 – 589A Quang Trung, Phường 11, Q. Gò Vấp, TP. HCM" },
      { address: "214 Phan Đăng Lưu, Phường 3, Q. Phú Nhuận, TP. HCM" },
    ],
  },
];

