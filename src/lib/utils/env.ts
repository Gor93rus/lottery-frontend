/**
 * Environment utility functions for checking development/production mode
 * and mock authentication status.
 */

/**
 * Get API base URL and ensure it ends with /api
 * 
 * This function ensures consistent API URL construction across all API clients.
 * It handles cases where VITE_API_URL may or may not include the /api suffix,
 * and removes any trailing slashes before adding /api if needed.
 * 
 * @returns API base URL with /api suffix
 * 
 * @example
 * // When VITE_API_URL='https://example.com/api'
 * getApiBaseUrl() // returns 'https://example.com/api'
 * 
 * @example
 * // When VITE_API_URL='https://example.com'
 * getApiBaseUrl() // returns 'https://example.com/api'
 * 
 * @example
 * // When VITE_API_URL='https://example.com//'
 * getApiBaseUrl() // returns 'https://example.com/api'
 */
export function getApiBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_URL || 'https://lottery-backend-gm4j.onrender.com';
  
  // Remove all trailing slashes
  const cleanUrl = baseUrl.replace(/\/+$/, '');
  
  // Ensure /api suffix
  const url = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  
  console.log('📍 API Base URL:', url);
  
  return url;
}

/**
 * Check if we're in development mode
 * In production builds, import.meta.env.DEV is false
 */
export function isDevelopment(): boolean {
  return import.meta.env.DEV;
}

/**
 * Check if mock authentication should be enabled
 * Only enabled when VITE_ENABLE_MOCK_AUTH is explicitly set to 'true'
 * AND we're in development mode (never in production)
 * 
 * This prevents automatic mock auth in dev mode and requires explicit
 * configuration to enable mock authentication for testing.
 * Production builds will NEVER enable mock auth regardless of env var.
 */
export function isMockAuthEnabled(): boolean {
  // CRITICAL: Never enable mock auth in production builds
  if (!isDevelopment()) {
    return false;
  }
  
  return import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true';
}

/**
 * Check if DevTools should be visible
 * Only visible in development mode when mock auth is enabled
 * NEVER visible in production builds
 */
export function isDevToolsEnabled(): boolean {
  // CRITICAL: Never show dev tools in production builds
  if (!isDevelopment()) {
    return false;
  }
  
  return isMockAuthEnabled();
}
