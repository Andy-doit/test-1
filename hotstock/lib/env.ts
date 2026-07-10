import { normalizeUrl } from "@/lib/utils/url";

const primaryApiHost = normalizeUrl(process.env.NEXT_PUBLIC_API_URL);
const fallbackApiHost = normalizeUrl(process.env.NEXT_PUBLIC_DEV_API_URL);

const apiBaseUrl = primaryApiHost || fallbackApiHost || "";

export const env = {
  apiBaseUrl,
  // Uploaded media (article images) is served by this Next.js app itself at
  // same-origin `/uploads/...` — never through the backend API host. Only
  // prefix with a media host when one is explicitly configured (e.g. a CDN);
  // falling back to apiBaseUrl here previously produced broken image URLs
  // like `http://backend-host/api/v1/uploads/...`, which doesn't exist.
  mediaBaseUrl: normalizeUrl(process.env.NEXT_PUBLIC_MEDIA_BASE_URL),
  isProduction: process.env.NODE_ENV === "production",
};

export type EnvConfig = typeof env;

