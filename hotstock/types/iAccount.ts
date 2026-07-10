import { z } from "zod";

export const baseSchema = z.object({
  email: z.string().min(1, "Email không được bỏ trống").email("Email không hợp lệ"),
  // FIX: Increased minimum password length from 6 to 8 characters per OWASP recommendation
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  remember: z.boolean().optional(),
});

export const registerSchema = baseSchema.extend({
  username: z.string().min(2, "Username tối thiểu 2 ký tự"),
  fullName: z.string().min(2, "Họ và tên tối thiểu 2 ký tự").max(100, "Họ và tên không quá 100 ký tự"),
  phoneNumber: z.string().regex(/^(0|\+84)[3-9][0-9]{8}$/, "Số điện thoại không hợp lệ"),
  confirmPassword: z.string().min(8, "Xác nhận mật khẩu tối thiểu 8 ký tự"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export type BaseValues = z.infer<typeof baseSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type AuthFormValues = BaseValues & Partial<Pick<RegisterValues, "username" | "fullName" | "phoneNumber" | "confirmPassword">>;

export interface AuthFormProps {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  auxiliaryLink?: { href: string; label: string };
  switchText?: string;
  switchHref?: string;
  showUsernameField?: boolean;
  showRememberToggle?: boolean;
  showProviders?: boolean;
  onSubmit?: (values: AuthFormValues) => Promise<void> | void;
}
export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  confirmPassword: string;
}

export type PlanType = "bronze" | "titan" | "gold" | "premium" | null;

export interface Plan {
  id: number;
  name: string;
  slug: string;
  level: number;
}

export interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  plan: Plan | null;
  role?: string;
  avatarUrl?: string;
}

export interface LoginResponse {
  jwt: string;
  user: User;
}
export type PremiumCardVariant = "titan" | "gold" | "premium";

export interface PremiumCardProps {
  variant: PremiumCardVariant;
  title: string;
  label?: string;
  monthlyPrice: number;
  originalSixMonthPrice?: number;
  sixMonthPrice?: number;
  description: string;
  buttonText: string;
  badge?: string;
  features: string[];
  icon?: import("lucide-react").LucideIcon;
  onAction?: () => void;
}

