
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_CONFIG } from "@/lib/constants";

// Fallback error message nếu không có message cụ thể
const DEFAULT_ERROR_MESSAGE = "Có lỗi xảy ra";

/**
 * Result type cho Server Actions
 */
export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Wrapper để xử lý errors trong Server Actions
 */
export async function handleServerAction<T>(
  action: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : DEFAULT_ERROR_MESSAGE;
    return { success: false, error: message };
  }
}

/**
 * Lấy auth token từ cookies
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");
  return token?.value ?? null;
}

/**
 * Set auth token vào cookies
 */
export async function setAuthToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  const isSecure = process.env.NODE_ENV === "production";

  cookieStore.set("auth_token", token, {
    ...COOKIE_CONFIG,
    secure: isSecure,
  });
}

/**
 * Clear auth token từ cookies
 */
export async function clearAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}

/**
 * Require authentication - redirect nếu không có token
 */
export async function requireAuth(): Promise<string> {
  const token = await getAuthToken();

  if (!token) {
    redirect("/login");
  }

  return token;
}

