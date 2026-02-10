import { getApiBaseUrl } from '../utils/env';
import type { User, Lottery, Draw, Ticket, AdminStats } from '../../types/api';

const API_BASE_URL = getApiBaseUrl();

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UserFilters extends PaginationParams {
  search?: string;
  level?: string;
  walletConnected?: boolean;
}

interface TicketFilters extends PaginationParams {
  lotteryId?: number;
  userId?: number;
  status?: 'active' | 'won' | 'lost';
  ticketId?: string;
}

interface NotificationData {
  id: string;
  message: string;
  userId?: number;
  broadcast?: boolean;
  createdAt: string;
  status: string;
}

export interface WinnerInfo {
  userId: string;
  ticketId: string;
  prize: number;
  matchedNumbers: number;
}

class AdminApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Admin API request failed');
    }

    return response.json();
  }

  // Check if current user is admin
async checkAdminStatus() {
  return this.request<{
    success: boolean;
    isAdmin: boolean;
    role?: string;
  }>('/admin/auth/check');  // ✅ ПРАВИЛЬНО
}

  // Dashboard statistics
  async getStats() {
    return this.request<{
      success: boolean;
      stats: AdminStats;
    }>('/admin/stats');
  }

  // User management
  async getUsers(filters?: UserFilters) {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.level) params.append('level', filters.level);
    if (filters?.walletConnected !== undefined) {
      params.append('walletConnected', filters.walletConnected.toString());
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<{
      success: boolean;
      users: User[];
      pagination: PaginationInfo;
    }>(`/admin/users${query}`);
  }

  async getUserDetails(id: number) {
    return this.request<{
      success: boolean;
      user: User;
    }>(`/admin/users/${id}`);
  }

  // Lottery management
  async getLotteries() {
    return this.request<{
      success: boolean;
      lotteries: Lottery[];
    }>('/admin/lotteries');
  }

  async updateLottery(id: number, data: Partial<Lottery>) {
    return this.request<{
      success: boolean;
      lottery: Lottery;
    }>(`/admin/lotteries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async createLottery(data: Omit<Lottery, 'id'>) {
    return this.request<{
      success: boolean;
      lottery: Lottery;
    }>('/admin/lotteries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Draw management
  async getDraws(filters?: PaginationParams) {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<{
      success: boolean;
      draws: Draw[];
      pagination?: PaginationInfo;
    }>(`/admin/draws${query}`);
  }

  async createDraw(data: Partial<Draw>) {
    return this.request<{
      success: boolean;
      draw: Draw;
    }>('/admin/draws', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async executeDraw(id: number) {
    return this.request<{
      success: boolean;
      draw: Draw;
      winners: WinnerInfo[];
    }>(`/admin/draws/${id}/execute`, {
      method: 'POST',
    });
  }

  // Ticket management
  async getTickets(filters?: TicketFilters) {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.lotteryId) params.append('lotteryId', filters.lotteryId.toString());
    if (filters?.userId) params.append('userId', filters.userId.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.ticketId) params.append('ticketId', filters.ticketId);

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<{
      success: boolean;
      tickets: Ticket[];
      pagination: PaginationInfo;
    }>(`/admin/tickets${query}`);
  }

  // Notifications
  async sendNotification(data: {
    message: string;
    userId?: number;
    broadcast?: boolean;
  }) {
    return this.request<{
      success: boolean;
      notification: NotificationData;
    }>('/admin/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getNotifications(filters?: PaginationParams) {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<{
      success: boolean;
      notifications: NotificationData[];
      pagination?: PaginationInfo;
    }>(`/admin/notifications${query}`);
  }
}

export const adminApiClient = new AdminApiClient(API_BASE_URL);
