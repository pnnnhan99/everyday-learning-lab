export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function fetcher<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch { /* ignore */ }
    throw new ApiError(res.status, message);
  }
  const body = await res.json();
  return (body?.data ?? body) as T;
}
