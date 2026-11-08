export interface ApiOptions extends RequestInit {
  params?: Record<string, string | number>;
  baseUrl?: string;
}

export const API_BASE_URL = 'https://shopboard-api.vercel.app';

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const data: T = await response.json();
  return data;
}

export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const isAbsolute = endpoint.startsWith('http://') || endpoint.startsWith('https://');
  const base = options.baseUrl ?? (isAbsolute ? '' : API_BASE_URL);
  let url = base ? `${base.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}` : endpoint;

  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, val]) => {
      searchParams.append(key, String(val));
    });
    url += (url.includes('?') ? '&' : '?') + searchParams.toString();
  }

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`كود استجابة الخادم: ${response.status} (${response.statusText || 'Error'})`);
  }

  return parseJsonResponse<T>(response);
}
