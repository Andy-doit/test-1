import { safeJsonParse } from './safe-json-parse';
import { Logger } from '@nestjs/common';

const mockLogger = {
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};

describe('safeJsonParse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should parse a valid JSON string and return the object', () => {
    const input = JSON.stringify({ id: 1, name: 'Test' });
    const result = safeJsonParse<{ id: number; name: string }>(input, mockLogger as unknown as Logger, 'test:key');
    expect(result).toEqual({ id: 1, name: 'Test' });
  });

  it('should return null and log a warning for corrupted JSON', () => {
    const result = safeJsonParse<{ id: number }>('not valid json {{{', mockLogger as unknown as Logger, 'test:key');
    expect(result).toBeNull();
    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Corrupted cache entry'),
    );
  });

  it('should return null for empty string', () => {
    const result = safeJsonParse<{ id: number }>('', mockLogger as unknown as Logger, 'test:key');
    expect(result).toBeNull();
  });

  it('should parse a complex nested object', () => {
    const complex = {
      overview: { totalArticles: 10, totalUsers: 5 },
      recentArticles: [{ id: 1, title: 'Article', publishedAt: null }],
    };
    const result = safeJsonParse<typeof complex>(
      JSON.stringify(complex),
      mockLogger as unknown as Logger,
      'dashboard:stats',
    );
    expect(result).toEqual(complex);
    expect(mockLogger.debug).not.toHaveBeenCalled(); // no debug call on miss
  });
});
