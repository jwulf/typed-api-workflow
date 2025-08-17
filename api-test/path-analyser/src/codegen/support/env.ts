export function buildBaseUrl(): string {
  return process.env.API_BASE_URL || 'http://localhost:8080';
}

export async function authHeaders(): Promise<Record<string,string>> {
  const token = process.env.API_TOKEN || 'dev-token';
  // Do not set Content-Type here; request options (data vs multipart) will determine it.
  return { 'Authorization': `Bearer ${token}` };
}
