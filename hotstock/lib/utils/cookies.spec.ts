import { describe, it, expect, beforeEach } from 'vitest';
import { setAuthCookies, clearAuthCookies, getClientCookie } from './cookies';

describe('cookies utility', () => {
  beforeEach(() => {
    // Clear all cookies before each test
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        if (name) {
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
      }
    }
  });

  it('should set auth cookies correctly', () => {
    setAuthCookies('accessToken123', 'refreshToken456');

    expect(getClientCookie('auth_token')).toBe('accessToken123');
    expect(getClientCookie('refresh_token')).toBe('refreshToken456');
  });

  it('should get client cookie by name', () => {
    document.cookie = 'test_cookie=value123; path=/';
    expect(getClientCookie('test_cookie')).toBe('value123');
    expect(getClientCookie('non_existent')).toBeNull();
  });

  it('should clear auth cookies', () => {
    setAuthCookies('accessToken123', 'refreshToken456');
    document.cookie = 'sidebar_state=expanded; path=/';

    expect(getClientCookie('auth_token')).toBe('accessToken123');
    expect(getClientCookie('refresh_token')).toBe('refreshToken456');
    expect(getClientCookie('sidebar_state')).toBe('expanded');

    clearAuthCookies();

    // JSDOM has some limitations with domains, but basic clearance on root should work.
    expect(getClientCookie('auth_token')).toBeNull();
    expect(getClientCookie('refresh_token')).toBeNull();
  });
});
