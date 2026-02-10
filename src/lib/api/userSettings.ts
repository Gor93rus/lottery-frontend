import { getApiBaseUrl } from '../utils/env';

const API_BASE_URL = getApiBaseUrl();

function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

export async function getNotificationSettings() {
  const response = await fetch(`${API_BASE_URL}/user/notification-settings`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch notification settings');
  }
  
  return response.json();
}

export async function updateNotificationSettings(settings: {
  drawReminder?: boolean;
  drawResults?: boolean;
  referrals?: boolean;
}) {
  const response = await fetch(`${API_BASE_URL}/user/notification-settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(settings)
  });
  
  if (!response.ok) {
    throw new Error('Failed to update notification settings');
  }
  
  return response.json();
}
