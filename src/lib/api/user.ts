import { getApiBaseUrl } from '../utils/env';

const API_BASE_URL = getApiBaseUrl();

function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

export async function getUserBalance() {
  const response = await fetch(`${API_BASE_URL}/user/balance`, {
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user balance');
  }
  
  const data = await response.json();
  return data.success ? data : { balance: 0 };
}
