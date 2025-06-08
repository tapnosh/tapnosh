import { auth } from "@clerk/nextjs/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL in environment variables.");
}

export async function authFetch(path: string, options: RequestInit = {}) {
  const { getToken } = await auth();
  const token = await getToken();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = new URL(path, BASE_URL);

  return fetch(url, {
    ...options,
    headers,
  });
}
