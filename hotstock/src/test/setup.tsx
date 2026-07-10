import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string }) =>
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    section: 'section',
    span: 'span',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', () => ({
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
  })),
}));

// Mock axios/http client
vi.mock('@/lib/http/httpClient', () => ({
  backendClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));
