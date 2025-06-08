"use client";

import { SWRConfig } from "swr";
import { useAuth } from "@clerk/nextjs";

export function SWRProvider({ children }: { children: React.ReactNode }) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { getToken } = useAuth();

  const fetcher = async (resource: string, init?: RequestInit) => {
    const token = await getToken();
    return fetch(new URL(resource, BASE_URL), {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => res.json());
  };

  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher,
      }}
    >
      {children}
    </SWRConfig>
  );
}
