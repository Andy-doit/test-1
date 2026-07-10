import Link from 'next/link';
import Image from 'next/image';
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Youtube } from 'lucide-react';

// PERF: [RE-RENDER] Wrap pure functional component in React.memo
export const UserFooter = memo(function UserFooter() {
  return (
    <footer className="bg-background relative z-10">
      <Separator />
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <FooterBrand />
         
          <FooterSection 
            title="Thị trường live"
            links={[
              { label: 'Chứng khoán Việt Nam', href: '/market/stockVN' },
              { label: 'Crypto Bitcoin', href: '/market/cryptoBitcoin' },
              { label: 'Giá vàng', href: '/market/goldPrice' },
              { label: 'Tỉ giá ngoại tệ', href: '/market/forexRates' }
            ]}
          />
           <FooterSection 
            title="Phân tích"
            links={[
              { label: 'Tin tức kinh tế', href: '/news/economic' },
              { label: 'Tin tức doanh nghiệp', href: '/news/business' },
              { label: 'Nhận định thị trường ', href: '/news/daily-market' },
              { label: 'Phân tích báo cáo', href: '/news/report-analysis' },
              { label: 'Lịch kinh tế', href: '/news/calenderEconomic' },
            ]}
          />
              <FooterSection 
            title="Danh mục đầu tư"
            links={[
              { label: 'Danh mục cộng đồng', href: '/portfolio/free' },
              { label: 'Danh mục Titan', href: '/portfolio/titan' },
              { label: 'Danh mục Gold', href: '/portfolio/gold' },
              { label: 'Danh mục Premium', href: '/portfolio/premium' }
            ]}
          />
          <FooterSocial />
          
        </div>
        
        <FooterCopyright />
      </div>
    </footer>
  );
});

// Sub-components
// PERF: [RE-RENDER] Wrap pure functional component in React.memo
const FooterBrand = memo(function FooterBrand() {
  return (
  <div>
    <div className="flex items-center space-x-2 mb-4">
      <Link href="/" className="flex items-center gap-2 relative">
        {/* PERF: [IMAGE] Replace img with next/image */}
        <Image src="/logo1.svg" alt="HotStock Logo" width={40} height={40} className="h-10" style={{ width: 'auto' }} />
        <Image src="/logo2.svg" alt="HotStock Text" width={160} height={40} className="h-10" style={{ width: 'auto' }} />
        <div className="absolute inset-0 rounded-full blur-md dark:bg-purple-500/30 dark:opacity-60 pointer-events-none" />
      </Link>
    </div>
    <p className="text-foreground/70 text-sm">
    Đầu tư thông minh, lợi nhuận bền vững
    </p>
  </div>
  );
});

interface FooterSectionProps {
  title: string;
  links: Array<{ label: string; href: string }>;
}

// PERF: [RE-RENDER] Wrap pure functional component in React.memo
const FooterSection = memo(function FooterSection({ title, links }: FooterSectionProps) {
  return (
  <div>
    <h3 className="font-semibold mb-4" style={{ color: 'var(--title)' }}>{title}</h3>
    <ul className="space-y-2 text-sm text-foreground/70">
      {links.map((link) => (
        <li key={link.label}>
          <Link href={link.href} className="hover:text-[color:var(--title)]">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
  );
});

// PERF: [RE-RENDER] Wrap pure functional component in React.memo
const FooterSocial = memo(function FooterSocial() {
  return (
  <div>
    <h3 className="font-semibold mb-4" style={{ color: 'var(--title)' }}>Theo dõi</h3>
    <div className="flex space-x-4">
      <Button
        variant="outline"
        size="sm"
        asChild
        className="hover:bg-[#1877F2]/10 hover:border-[#1877F2] hover:text-[#1877F2] transition-colors"
      >
        <a
          href="https://www.facebook.com/HotStock.vn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook HotStock"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </Button>
      <Button
        variant="outline"
        size="sm"
        asChild
        className="hover:bg-[#FF0000]/10 hover:border-[#FF0000] hover:text-[#FF0000] transition-colors"
      >
        <a
          href="https://youtube.com/@hotstockvn-com?si=b4oVYMtaQNvEP2be"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Youtube HotStock"
        >
          <Youtube className="h-4 w-4" />
        </a>
      </Button>
      <Button
        variant="outline"
        size="sm"
        asChild
        className="hover:bg-[#000000]/10 hover:border-[#000000] hover:text-[#000000] dark:hover:bg-[#FFFFFF]/10 dark:hover:border-[#FFFFFF] dark:hover:text-[#FFFFFF] transition-colors"
      >
        <a
          href="https://www.tiktok.com/@hotstockvn.com?_r=1&_t=ZS-918pEt3aj0k"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok HotStock"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        </a>
      </Button>
    </div>
  </div>
  );
});

// PERF: [RE-RENDER] Wrap pure functional component in React.memo
const FooterCopyright = memo(function FooterCopyright() {
  return (
  <div className="mt-8 text-center text-sm text-foreground/70">
    <Separator className="mb-8" />
    <p>&copy; 2024 HotStock. Tất cả quyền được bảo lưu.</p>
  </div>
  );
});