/*
  Минимальный HTTP-клиент на fetch:
  - Base URL и дефолтные заголовки
  - Таймаут через AbortController
  - Простые ретраи по сетевым ошибкам/5xx (фиксированный интервал)
  - JSON (де)сериализация
*/

import { ApiError } from './errors';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig<TBody = unknown> {
  method?: HttpMethod;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: TBody;
  timeoutMs?: number;
  signal?: AbortSignal;
  retries?: number; // количество повторов при ошибке (по умолчанию 0)
}

export interface HttpClientOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
  timeoutMs?: number; // таймаут по умолчанию
}

function buildQueryString(query?: RequestConfig['query']): string {
  if (!query) return '';
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    params.append(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

function withTimeout(
  signal: AbortSignal | undefined,
  timeoutMs: number | undefined,
): AbortSignal | undefined {
  if (!timeoutMs) return signal;
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(new DOMException('Timeout', 'AbortError')),
    timeoutMs,
  );
  if (signal)
    signal.addEventListener('abort', () => controller.abort(signal.reason));
  controller.signal.addEventListener('abort', () => clearTimeout(timer));
  return controller.signal;
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly defaultTimeout?: number;

  constructor(options: HttpClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? '';
    this.defaultHeaders = Object.assign(
      { 'Content-Type': 'application/json', Accept: 'application/json' },
      options.headers ?? {},
    );
    this.defaultTimeout = options.timeoutMs;
  }

  async request<TResponse = unknown, TBody = unknown>(
    path: string,
    config: RequestConfig<TBody> = {},
  ): Promise<TResponse> {
    const method = config.method ?? 'GET';
    const url = new URL(`${this.baseUrl}${path}`);
    const qs = buildQueryString(config.query);
    const finalUrl = qs ? url.toString() + qs : url.toString();

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(config.headers ?? {}),
    };

    const init: RequestInit = {
      method,
      headers,
      body:
        config.body !== undefined && method !== 'GET'
          ? JSON.stringify(config.body)
          : undefined,
      signal: withTimeout(
        config.signal,
        config.timeoutMs ?? this.defaultTimeout,
      ),
    };

    const maxRetries = Math.max(0, config.retries ?? 0);
    let attempt = 0;
    while (true) {
      try {
        const response = await fetch(finalUrl, init);
        if (!response.ok) {
          const errorBody = await safeParseJson(response);
          const message =
            extractMessage(errorBody) ||
            response.statusText ||
            'Request failed';
          const apiError = new ApiError(message, response.status, errorBody);
          if (attempt < maxRetries && shouldRetry(response.status)) {
            await wait(300);
            attempt++;
            continue;
          }
          throw apiError;
        }

        if (response.status === 204) return undefined as unknown as TResponse;
        const data = await safeParseJson(response);
        return data as TResponse;
      } catch (err) {
        if (isAbortError(err)) throw err;
        if (attempt < maxRetries) {
          await wait(300);
          attempt++;
          continue;
        }
        if (err instanceof ApiError) throw err;
        throw new ApiError('Network error', 0, { cause: stringifyError(err) });
      }
    }
  }

  get<TResponse = unknown>(
    path: string,
    config: Omit<RequestConfig, 'method' | 'body'> = {},
  ) {
    return this.request<TResponse>(path, { ...config, method: 'GET' });
  }

  post<TResponse = unknown, TBody = unknown>(
    path: string,
    body?: TBody,
    config: Omit<RequestConfig<TBody>, 'method' | 'body'> = {},
  ) {
    return this.request<TResponse, TBody>(path, {
      ...config,
      method: 'POST',
      body,
    });
  }

  put<TResponse = unknown, TBody = unknown>(
    path: string,
    body?: TBody,
    config: Omit<RequestConfig<TBody>, 'method' | 'body'> = {},
  ) {
    return this.request<TResponse, TBody>(path, {
      ...config,
      method: 'PUT',
      body,
    });
  }

  patch<TResponse = unknown, TBody = unknown>(
    path: string,
    body?: TBody,
    config: Omit<RequestConfig<TBody>, 'method' | 'body'> = {},
  ) {
    return this.request<TResponse, TBody>(path, {
      ...config,
      method: 'PATCH',
      body,
    });
  }

  delete<TResponse = unknown>(
    path: string,
    config: Omit<RequestConfig, 'method' | 'body'> = {},
  ) {
    return this.request<TResponse>(path, { ...config, method: 'DELETE' });
  }
}

async function safeParseJson(response: Response): Promise<unknown> {
  const contentType =
    response.headers.get('Content-Type') ||
    response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return undefined;
    }
  }
  // Fallback to text
  try {
    const text = await response.text();
    return text ? { text } : undefined;
  } catch {
    return undefined;
  }
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function shouldRetry(status: number): boolean {
  return status === 429 || status >= 500;
}

function stringifyError(err: unknown): string {
  if (err instanceof Error) return `${err.name}: ${err.message}`;
  return String(err);
}

function extractMessage(body: unknown): string | undefined {
  if (body && typeof body === 'object') {
    const asRecord = body as Record<string, unknown>;
    const raw = asRecord.message ?? asRecord.error;
    if (typeof raw === 'string') return raw;
  }
  return undefined;
}

// Default client instance with env-based base URL and auth header passthrough (if needed)
export const httpClient = new HttpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  headers: {},
  timeoutMs: 10_000,
});
