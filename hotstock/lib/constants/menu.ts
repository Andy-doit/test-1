/**
 * Menu constants for navigation
 */
export type UserMenuItem = {
  title: string;
  href: string;
  description: string;
};

export const USER_MENU_ITEMS: readonly UserMenuItem[] = [
  {
    title: 'Trang chủ',
    href: '/',
    description: 'Tin tức mới nhất'
  },
  {
    title: 'Phân tích ',
    href: '/thi-truong/stockVN',
    description: 'Tin tức hot'
  },
  {
    title: 'Thị trường live',
    href: '/phan-tich',
    description: 'Tất cả tin tức'
  },
  {
    title: 'Danh mục đầu tư',
    href: '/danh-muc-dau-tu',
    description: 'Tin tức hot'
  },
  {
    title: 'Gói hội viên',
    href: '/goi-hoi-vien',
    description: 'Bài viết đã lưu'
  },
  {
    title: 'Liên Hệ',
    href: '/lien-he',
    description: 'Tin tức hot'
  },
] as const;

/**
 * Market submenu items
 */
export const MARKET_SUBMENU_ITEMS = [
  { label: 'Chứng khoán Việt Nam', href: '/thi-truong/stockVN' },
  { label: 'Crypto Bitcoin', href: '/thi-truong/cryptoBitcoin' },
  { label: 'Giá Vàng', href: '/thi-truong/goldPrice' },
  { label: 'Tỉ giá ngoại tệ', href: '/thi-truong/forexRates' },
] as const;

/**
 * Analysis submenu items
 */
export const ANALYSIS_SUBMENU_ITEMS = [
  { label: 'Tin tức kinh tế', href: '/phan-tich/economic' },
  { label: 'Tin tức doanh nghiệp', href: '/phan-tich/business' },
  { label: 'Nhận định thị trường hằng ngày', href: '/phan-tich/dailyMarket' },
  { label: 'Phân tích báo cáo', href: '/phan-tich/reportAnalysis' },
  { label: 'Lịch kinh tế', href: '/phan-tich/calenderEconomic' },
] as const;

/**
 * Portfolio submenu items
 */
export const PORTFOLIO_SUBMENU_ITEMS = [
  { label: 'Danh mục cộng đồng', href: '/danh-muc-dau-tu/free' },
  { label: 'Danh mục Titan', href: '/danh-muc-dau-tu/titan' },
  { label: 'Danh mục Gold', href: '/danh-muc-dau-tu/gold' },
  { label: 'Danh mục Premium', href: '/danh-muc-dau-tu/premium' },
] as const;

