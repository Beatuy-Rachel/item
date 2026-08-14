const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const config: RequestInit = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '请求失败' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: { username: string; password: string; nickname?: string }) =>
      request<{ token: string; user: { id: number; username: string; nickname: string } }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    login: (data: { username: string; password: string }) =>
      request<{ token: string; user: { id: number; username: string; nickname: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getMe: (token: string) =>
      request<{ user: { id: number; username: string; nickname: string } }>('/auth/me', { token }),
  },

  items: {
    list: (token: string, params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ items: import('@/types').Item[] }>(`/items${query}`, { token });
    },
    get: (token: string, id: string) =>
      request<{ item: import('@/types').Item }>(`/items/${id}`, { token }),
    create: (token: string, data: Partial<import('@/types').Item>) =>
      request<{ item: import('@/types').Item }>('/items', {
        method: 'POST',
        token,
        body: JSON.stringify(data),
      }),
    update: (token: string, id: string, data: Partial<import('@/types').Item>) =>
      request<{ item: import('@/types').Item }>(`/items/${id}`, {
        method: 'PUT',
        token,
        body: JSON.stringify(data),
      }),
    delete: (token: string, id: string) =>
      request<{ message: string }>(`/items/${id}`, {
        method: 'DELETE',
        token,
      }),
  },

  wishes: {
    list: (token: string, params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ wishes: import('@/types').Wish[] }>(`/wishes${query}`, { token });
    },
    get: (token: string, id: string) =>
      request<{ wish: import('@/types').Wish }>(`/wishes/${id}`, { token }),
    create: (token: string, data: Partial<import('@/types').Wish>) =>
      request<{ wish: import('@/types').Wish }>('/wishes', {
        method: 'POST',
        token,
        body: JSON.stringify(data),
      }),
    update: (token: string, id: string, data: Partial<import('@/types').Wish>) =>
      request<{ wish: import('@/types').Wish }>(`/wishes/${id}`, {
        method: 'PUT',
        token,
        body: JSON.stringify(data),
      }),
    delete: (token: string, id: string) =>
      request<{ message: string }>(`/wishes/${id}`, {
        method: 'DELETE',
        token,
      }),
    addSavings: (token: string, id: string, amount: number) =>
      request<{ wish: import('@/types').Wish }>(`/wishes/${id}/savings`, {
        method: 'POST',
        token,
        body: JSON.stringify({ amount }),
      }),
    markAchieved: (token: string, id: string) =>
      request<{ wish: import('@/types').Wish }>(`/wishes/${id}/achieve`, {
        method: 'POST',
        token,
      }),
  },

  stats: {
    summary: (token: string) =>
      request<{
        items: { totalItems: number; totalValue: number; activeItems: number; thisMonthItems: number; thisMonthValue: number };
        wishes: { totalWishes: number; activeWishes: number; achievedWishes: number; totalTargetPrice: number; totalSaved: number };
      }>('/stats/summary', { token }),
    byCategory: (token: string) =>
      request<{
        categoryStats: import('@/types').CategoryStat[];
        totalValue: number;
      }>('/stats/by-category', { token }),
    monthly: (token: string, months?: number) =>
      request<{
        monthlyStats: { month: string; value: number; count: number }[];
      }>(`/stats/monthly${months ? `?months=${months}` : ''}`, { token }),
    yearly: (token: string) =>
      request<{
        yearlyStats: { year: number; value: number; count: number }[];
      }>('/stats/yearly', { token }),
  },

  importData: {
    importData: (token: string, data: { items?: import('@/types').Item[]; wishes?: import('@/types').Wish[] }) =>
      request<{ message: string; importedItems: number; importedWishes: number }>('/import', {
        method: 'POST',
        token,
        body: JSON.stringify(data),
      }),
  },
};
