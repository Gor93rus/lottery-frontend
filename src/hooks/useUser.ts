/**
 * Custom hook for user data management
 */

import { useAuth } from './useAuth';

export function useUser() {
  const { user, isAuthenticated, isLoading } = useAuth();

  /**
   * Get user's display name
   */
  const getDisplayName = (): string => {
    if (!user) {
      return 'Guest';
    }

    if (user.username) {
      return user.username;
    }

    const parts = [];
    if (user.firstName) {
      parts.push(user.firstName);
    }
    if (user.lastName) {
      parts.push(user.lastName);
    }

    return parts.join(' ') || 'User';
  };

  /**
   * Get user's initials
   */
  const getInitials = (): string => {
    if (!user) {
      return '?';
    }

    const parts = [];
    if (user.firstName) {
      parts.push(user.firstName[0]);
    }
    if (user.lastName) {
      parts.push(user.lastName[0]);
    }

    if (parts.length === 0 && user.username) {
      return user.username[0].toUpperCase();
    }

    return parts.join('').toUpperCase() || '?';
  };

  /**
   * Check if user is admin
   */
  const isAdmin = (): boolean => {
    return user?.isAdmin === true || user?.role === 'admin';
  };

  /**
   * Get user level as number
   * Note: User.level is stored as a string representation of a number
   * Returns 1 as default if level is not a valid number
   */
  const getLevelNumber = (): number => {
    if (!user) {
      return 1;
    }

    const level = parseInt(user.level, 10);
    return isNaN(level) ? 1 : level;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    displayName: getDisplayName(),
    initials: getInitials(),
    isAdmin: isAdmin(),
    level: getLevelNumber(),
  };
}
