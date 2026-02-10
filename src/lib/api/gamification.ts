import { getApiBaseUrl } from '../utils/env';

const API_BASE_URL = getApiBaseUrl();

function getAuthHeaders(userId?: string) {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (userId) {
    headers['x-user-id'] = userId;
  }
  
  return headers;
}

export async function getGamificationData(userId?: string) {
  const headers = getAuthHeaders(userId);
  
  const [profileRes, questsRes, achievementsRes] = await Promise.all([
    fetch(`${API_BASE_URL}/gamification/profile`, { headers }),
    fetch(`${API_BASE_URL}/gamification/quests`, { headers }),
    fetch(`${API_BASE_URL}/gamification/achievements`, { headers })
  ]);

  const profileData = profileRes.ok ? await profileRes.json() : null;
  const questsData = questsRes.ok ? await questsRes.json() : { quests: [] };
  const achievementsData = achievementsRes.ok ? await achievementsRes.json() : { achievements: [] };

  return {
    level: profileData?.success ? profileData.level : null,
    dailyTasks: questsData?.success ? questsData.quests : [],
    achievements: achievementsData?.success ? achievementsData.achievements : []
  };
}

export async function getUserStats(userId?: string) {
  const response = await fetch(`${API_BASE_URL}/user/stats`, {
    headers: getAuthHeaders(userId)
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user stats');
  }
  
  const data = await response.json();
  return data.success ? data.stats : null;
}

export async function claimDailyTask(taskId: string, userId?: string) {
  const response = await fetch(`${API_BASE_URL}/gamification/quests/${taskId}/claim`, {
    method: 'POST',
    headers: getAuthHeaders(userId)
  });
  
  if (!response.ok) {
    throw new Error('Failed to claim daily task');
  }
  
  return response.json();
}
