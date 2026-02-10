/**
 * API Error Handling Utilities
 * 
 * Custom error classes and utilities for handling API errors consistently.
 */

/**
 * Base API Error class
 */
export class ApiError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Network Error - for connection issues
 */
export class NetworkError extends ApiError {
  constructor(message: string = 'Network connection failed', details?: unknown) {
    super(message, 0, details);
    this.name = 'NetworkError';
  }
}

/**
 * Authentication Error - for 401 responses
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required', details?: unknown) {
    super(message, 401, details);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization Error - for 403 responses
 */
export class AuthorizationError extends ApiError {
  constructor(message: string = 'Insufficient permissions', details?: unknown) {
    super(message, 403, details);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not Found Error - for 404 responses
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found', details?: unknown) {
    super(message, 404, details);
    this.name = 'NotFoundError';
  }
}

/**
 * Validation Error - for 400/422 responses
 */
export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed', details?: unknown) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

/**
 * Server Error - for 500+ responses
 */
export class ServerError extends ApiError {
  constructor(message: string = 'Server error occurred', details?: unknown) {
    super(message, 500, details);
    this.name = 'ServerError';
  }
}

/**
 * Timeout Error - for request timeouts
 */
export class TimeoutError extends ApiError {
  constructor(message: string = 'Request timeout', details?: unknown) {
    super(message, 408, details);
    this.name = 'TimeoutError';
  }
}

/**
 * Parse error response and create appropriate error instance
 */
export function parseApiError(error: unknown, statusCode?: number): ApiError {
  // Handle network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new NetworkError('Unable to connect to server. Please check your internet connection.');
  }

  // Handle timeout errors
  if (error instanceof Error && (error.name === 'AbortError' || error.message?.includes('timeout'))) {
    return new TimeoutError('Request took too long. Please try again.');
  }

  // Handle existing ApiError instances
  if (error instanceof ApiError) {
    return error;
  }

  // Parse based on status code
  const errorObj = error as Record<string, unknown>;
  const status = statusCode || (errorObj.statusCode as number) || 500;
  const message = (errorObj.message as string) || (errorObj.error as string) || 'An unexpected error occurred';
  const details = errorObj.details || error;

  switch (status) {
    case 401:
      return new AuthenticationError(message, details);
    case 403:
      return new AuthorizationError(message, details);
    case 404:
      return new NotFoundError(message, details);
    case 400:
    case 422:
      return new ValidationError(message, details);
    case 408:
      return new TimeoutError(message, details);
    case 500:
    case 502:
    case 503:
    case 504:
      return new ServerError(message, details);
    default:
      return new ApiError(message, status, details);
  }
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): error is AuthenticationError {
  return error instanceof AuthenticationError || (typeof error === 'object' && error !== null && 'statusCode' in error && error.statusCode === 401);
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError || (typeof error === 'object' && error !== null && 'statusCode' in error && error.statusCode === 0);
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError || (typeof error === 'object' && error !== null && 'statusCode' in error && (error.statusCode === 400 || error.statusCode === 422));
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof NetworkError) {
    return 'Unable to connect. Please check your internet connection and try again.';
  }
  
  if (error instanceof AuthenticationError) {
    return 'Please log in to continue.';
  }
  
  if (error instanceof AuthorizationError) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error instanceof NotFoundError) {
    return 'The requested resource was not found.';
  }
  
  if (error instanceof ValidationError) {
    return error.message || 'Please check your input and try again.';
  }
  
  if (error instanceof TimeoutError) {
    return 'Request timed out. Please try again.';
  }
  
  if (error instanceof ServerError) {
    return 'Server is experiencing issues. Please try again later.';
  }
  
  if (error instanceof Error) {
    return error.message || 'An unexpected error occurred. Please try again.';
  }
  
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Handle API error globally (e.g., show toast notification)
 */
export function handleApiError(error: unknown, options?: {
  showNotification?: boolean;
  logError?: boolean;
  onAuthError?: () => void;
}) {
  const { showNotification = true, logError = true, onAuthError } = options || {};
  
  const apiError = parseApiError(error);
  
  // Log error in development
  if (logError && import.meta.env.DEV) {
    console.error('[API Error]', {
      name: apiError.name,
      message: apiError.message,
      statusCode: apiError.statusCode,
      details: apiError.details,
    });
  }
  
  // Handle authentication errors
  if (isAuthError(apiError) && onAuthError) {
    onAuthError();
  }
  
  // Show notification if enabled
  if (showNotification) {
    // TODO: Integrate with your notification system
    // For now, just console.warn
    console.warn('[User Message]', getUserFriendlyMessage(apiError));
  }
  
  return apiError;
}
