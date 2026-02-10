/**
 * TON RPC Call Cache with Rate Limiting
 * Prevents excessive API calls and implements exponential backoff
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface RateLimitState {
  requestCount: number;
  resetTime: number;
  backoffMultiplier: number;
  isLimited: boolean;
}

class TonRpcCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private rateLimitState: RateLimitState = {
    requestCount: 0,
    resetTime: 0,
    backoffMultiplier: 1,
    isLimited: false,
  };

  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly RATE_LIMIT_THRESHOLD = 100; // Requests per window
  private readonly TIME_WINDOW = 60 * 1000; // 1 minute
  private readonly MAX_BACKOFF = 30 * 1000; // 30 seconds max backoff

  /**
   * Get cached value if available and not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cached value with optional TTL
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Clear specific cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * Check if rate limited and apply backoff
   */
  async checkRateLimit(): Promise<void> {
    const now = Date.now();

    // Reset counter if time window has passed
    if (now > this.rateLimitState.resetTime) {
      this.rateLimitState.requestCount = 0;
      this.rateLimitState.resetTime = now + this.TIME_WINDOW;
      this.rateLimitState.backoffMultiplier = 1;
      this.rateLimitState.isLimited = false;
    }

    // Check if we're hitting rate limit
    if (this.rateLimitState.requestCount >= this.RATE_LIMIT_THRESHOLD) {
      this.rateLimitState.isLimited = true;

      const backoffTime = Math.min(
        this.rateLimitState.backoffMultiplier * 1000,
        this.MAX_BACKOFF
      );

      console.warn(
        `⚠️  TON RPC Rate Limited. Backoff: ${backoffTime}ms. Multiplier: ${this.rateLimitState.backoffMultiplier}x`
      );

      // Increase backoff multiplier for next time
      this.rateLimitState.backoffMultiplier = Math.min(
        this.rateLimitState.backoffMultiplier * 2,
        16
      );

      await new Promise((resolve) => setTimeout(resolve, backoffTime));
    }

    this.rateLimitState.requestCount++;
  }

  /**
   * Register a 429 error to increase backoff
   */
  handleRateLimitError(): void {
    this.rateLimitState.isLimited = true;
    this.rateLimitState.backoffMultiplier = Math.min(
      this.rateLimitState.backoffMultiplier * 2,
      16
    );
    this.rateLimitState.resetTime = Date.now() + this.TIME_WINDOW;

    console.warn(
      `📛 429 Error! Backoff multiplier increased to ${this.rateLimitState.backoffMultiplier}x`
    );
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      isRateLimited: this.rateLimitState.isLimited,
      backoffMultiplier: this.rateLimitState.backoffMultiplier,
      requestCount: this.rateLimitState.requestCount,
      resetTime: new Date(this.rateLimitState.resetTime),
    };
  }
}

// Export singleton instance
export const tonRpcCache = new TonRpcCache();
