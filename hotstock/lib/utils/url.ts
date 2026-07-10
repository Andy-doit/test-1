/**
 * Utility functions for URL normalization and manipulation
 * Shared across the application to ensure consistency
 */

/**
 * Normalizes a URL string by:
 * - Trimming whitespace
 * - Removing trailing slashes
 * - Removing /api suffix if present
 * 
 * @param value - URL string to normalize
 * @returns Normalized URL string or empty string if invalid
 */
export function normalizeUrl(value?: string | null): string {
  if (!value) return "";

  let normalized = value.trim();

  // Remove trailing slashes
  while (normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

/**
 * Builds a complete API base URL from a base host
 *
 * @param baseHost - Base host URL (e.g., "http://localhost:3001/api/v1")
 * @returns Normalized base URL (e.g., "http://localhost:3001/api/v1")
 */
export function buildApiBaseUrl(baseHost: string): string {
  if (!baseHost) return "/api/v1";

  return normalizeUrl(baseHost);
}

