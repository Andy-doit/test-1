import { env } from "@/lib/env";

export const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
} as const;

export const COOKIE_CLEAR_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 0,
} as const;

export const API_BASE_URL = env.apiBaseUrl;

