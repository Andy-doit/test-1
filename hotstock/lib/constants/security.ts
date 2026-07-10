/**
 * Security constants — centralized configuration for CSP and related policies.
 * When adding a new widget/iframe source, update ONLY this file.
 */

/**
 * Allowed iframe domains for CSP frame-src directive.
 * These are the financial widget providers currently embedded on the site.
 *
 * - TradingView widget (crypto market quotes)
 * - TradingView main (economic calendar)
 * - Tygiausd.org (VND exchange rates, gold prices)
 * - Investing.com widgets (FX cross rates)
 */
export const ALLOWED_IFRAME_DOMAINS = [
  'https://www.tradingview-widget.com',
  'https://www.tradingview.com',
  'https://tygiausd.org',
  'https://www.widgets.investing.com',
  'https://sslecal2.investing.com', // Investing.com Economic Calendar widget
  'https://trading.bsi.com.vn', // BSI Vietnam Stock trading widget
  'https://www.google.com', // Google Maps widget
] as const;

/**
 * Build the CSP frame-src directive value from the allowed domains.
 */
export function buildFrameSrcDirective(): string {
  return `frame-src 'self' ${ALLOWED_IFRAME_DOMAINS.join(' ')}`;
}