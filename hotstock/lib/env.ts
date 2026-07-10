import { normalizeUrl } from "@/lib/utils/url";

const primaryApiHost = normalizeUrl(process.env.NEXT_PUBLIC_API_URL);
const fallbackApiHost = normalizeUrl(process.env.NEXT_PUBLIC_DEV_API_URL);

const apiBaseUrl = primaryApiHost || fallbackApiHost || "";

export const env = {
  apiBaseUrl,
  mediaBaseUrl: normalizeUrl(
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? apiBaseUrl,
  ),
  isProduction: process.env.NODE_ENV === "production",
};

export type EnvConfig = typeof env;

