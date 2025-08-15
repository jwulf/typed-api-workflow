export function buildBaseUrl(): string {
  return process.env.API_BASE_URL || 'http://localhost:8080';
}

export async function authHeaders(): Promise<Record<string,string>> {
  const token = process.env.API_TOKEN || 'dev-token';
  return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
}
